// ===============================
// HighFlowAI Chatbot Backend
// ===============================
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------------
// OpenAI client (only created once)
// -------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// -------------------------------
// Middleware
// -------------------------------
app.use(cors());
app.use(express.json());

// -------------------------------
// Serve static files (for widget.js)
// -------------------------------
app.use(express.static('public')); 
// This serves:  https://your-backend.com/widget.js


// -------------------------------
// Multi-client configuration
// -------------------------------
const clients = {
  demo: {
    name: "HighFlowAI (Demo)",
    botName: "HighFlow Demo Assistant",
    systemPrompt: `
      You are the demo assistant for HighFlowAI.
      Your job is to explain AI automation, answer questions clearly,
      and encourage the user to explore HighFlowAI services.
    `
  },

  brisbane_real_estate: {
    name: "Brisbane Real Estate Group",
    botName: "Brisbane RE Assistant",
    systemPrompt: `
      You are a helpful assistant for a real estate business in Brisbane.
      You answer property questions, help with inspections,
      explain pricing, and encourage users to book a call or viewing.
    `
  },

  fitness_studio: {
    name: "Flow Fitness Studio",
    botName: "FlowFit Assistant",
    systemPrompt: `
      You assist gym members with class schedules, membership options,
      and general questions. Be energetic, friendly, and helpful.
    `
  }
};


// -------------------------------
// Health check
// -------------------------------
app.get('/', (req, res) => {
  res.send('HighFlowAI Chatbot Backend is running');
});


// -------------------------------
// Chat Endpoint
// -------------------------------
app.post('/api/chat', async (req, res) => {
  console.log("Incoming /api/chat request:", req.body);

  const { clientId, message } = req.body || {};

  if (!message) {
    return res.status(400).json({ reply: "No message received." });
  }

  // Default to "demo" if no clientId is provided
  const client = clients[clientId] || clients.demo;

  const systemContent =
    client.systemPrompt ||
    `You are ${client.botName}, a helpful assistant for ${client.name}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;
    console.log("OpenAI reply:", reply);

    return res.json({ reply });

  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message || err);

    return res.status(500).json({
      reply: "Sorry, I had trouble answering that just now."
    });
  }
});


// -------------------------------
// Start Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`HighFlowAI chatbot backend listening on port ${PORT}`);
});
