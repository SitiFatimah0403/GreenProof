const express = require('express');
//const fetch = require('node-fetch'); // sbb Node.js 18 dh ada build in fetch
const cors = require('cors');


const multer = require('multer');
const FormData = require('form-data');
const upload = multer();

const app = express();
app.use(express.json());
app.use(cors({ //cors = allow frontend (localhost 3000)to communicate with backend (localhost 5000) , diorang different domain
  origin: 'http://localhost:3000',
  credentials: true,
})); 

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Endpoint to handle NFA requests
app.post('/api/nfa', async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }),
      }
    );
    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No suggestion found.";
    res.json(data);
  } catch (err) {
    console.error("❌ NFA Gemini error:", err);
    res.status(500).json({ error: 'Failed to fetch from Google API' });
  }
});

// Endpoint to upload image to IPFS via Pinata
app.post('/api/upload-ipfs', upload.single('file'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    const metadata = JSON.stringify({ name: req.file.originalname });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataOptions', options);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      body: formData,
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        ...formData.getHeaders(),
      },
    });

    if (!response.ok) throw new Error('IPFS upload failed');
    const data = await response.json();
    res.json({ ipfsUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload to IPFS' });
  }
});

// Start the server , dia guna localhost 5000
app.listen(5000, () => console.log('Backend running on port 5000'));