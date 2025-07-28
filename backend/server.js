// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getNFAResponse } = require('./nfa');

const app = express();
app.use(cors()); // Allow frontend requests
app.use(bodyParser.json());

// NFA endpoint
app.post('/nfa-response', (req, res) => {
  const userInput = req.body.action;
  const response = getNFAResponse(userInput);
  res.json({ reply: response });
});

// Serve the React app
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
// Export the app for testing or further use