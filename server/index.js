import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from '@langchain/openai';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize vector store
let vectorStore;

// Sample knowledge base - in production, you'd load this from a database or files
const knowledgeBase = `
Modern chatbots use advanced AI technologies like GPT models.
They can understand context and maintain conversation history.
Vector stores help chatbots retrieve relevant information quickly.
WebSockets enable real-time communication between clients and servers.
LangChain is a framework for developing applications powered by language models.
`;

// Initialize the vector store with the knowledge base
async function initVectorStore() {
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const docs = await textSplitter.createDocuments([knowledgeBase]);
    
    vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );
    
    console.log('Vector store initialized successfully');
  } catch (error) {
    console.error('Error initializing vector store:', error);
  }
}

// Initialize the vector store when the server starts
initVectorStore();

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle chat messages
  socket.on('sendMessage', async (message) => {
    try {
      console.log('Received message:', message);
      
      // If vector store is initialized, search for relevant context
      let context = '';
      if (vectorStore) {
        const results = await vectorStore.similaritySearch(message.text, 2);
        context = results.map(doc => doc.pageContent).join('\n');
      }
      
      // Generate response using OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant. Use the following context to help answer the user's question if relevant: ${context}`
          },
          {
            role: "user",
            content: message.text
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      // Send the response back to the client
      socket.emit('receiveMessage', {
        id: Date.now().toString(),
        text: response.choices[0].message.content,
        sender: 'bot',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('receiveMessage', {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error processing your request.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});