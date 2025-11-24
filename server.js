const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Create OpenAI client ONCE
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// TEMP: In-memory client config
const clients = {
  demo: {
    name: 'Demo Client',
    botName: 'HighFlow Demo Assistant'
  }
};

// Health check
app.get('/', (req, res) => {
  res.send('HighFlowAI Chatbot Backend is running');
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('Incoming /api/chat request:', req.body);

  const { clientId, message } = req.body || {};

  if (!message) {
    return res.status(400).json({ reply: 'No message received.' });
  }

  const client = clients[clientId] || clients.demo;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are ${client.botName}, a helpful AI assistant for ${client.name}. Answer clearly and professionally.`
        },
        {
          role: 'user',
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;
    console.log('OpenAI reply:', reply);
    return res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err.response?.data || err.message || err);
    return res.status(500).json({
      reply: 'Sorry, I had trouble answering that just now.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`HighFlowAI chatbot backend listening on port ${PORT}`);
});
