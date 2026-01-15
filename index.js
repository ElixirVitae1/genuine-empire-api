const express = require('express');
  const cors = require('cors');
  const https = require('https');
  const app = express();
  app.use(cors());
  app.use(express.json());
  const BLAND_API_KEY = 'org_528af9c8815d1df5eb94556b347a28791a57f5cae869624c440c91035d59ca3df51dbab598cb5111cb3969';
  const FROM_PHONE = '+17146177121';
  app.post('/demo-call', async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length !== 12) return res.status(400).json({ error: 'Invalid phone' });
    const callData = JSON.stringify({
      phone_number: phone, from: FROM_PHONE,
      task: "You are Claudia, the AI receptionist demo. Say: Hi! This is Claudia from Genuine Empire AI! Thanks for requesting a demo! I work 24/7, speak English and Spanish. What type of business do you have?",
      first_sentence: "Hi! This is Claudia from Genuine Empire AI!",
      wait_for_greeting: true, record: true, max_duration: 300, voice: "maya", model: "enhanced"
    });
    try {
      const result = await new Promise((resolve, reject) => {
        const apiReq = https.request({ hostname: 'api.bland.ai', path: '/v1/calls', method: 'POST',
          headers: { 'Authorization': BLAND_API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(callData) }
        }, (response) => { let data = ''; response.on('data', chunk => data += chunk); response.on('end', () => resolve(JSON.parse(data))); });
        apiReq.on('error', reject); apiReq.write(callData); apiReq.end();
      });
      res.json(result);
    } catch (error) { res.status(500).json({ error: error.message }); }
  });
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log('Server running on port ' + PORT));
