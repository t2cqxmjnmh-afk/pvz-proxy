export default async function handler(req, res) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: "Missing or invalid request body" });
  }

  const { imageData } = req.body;
  
  if (!imageData) {
    return res.status(400).json({ error: "Missing imageData" });
  }

  const apiKey = process.env.API_KEY;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Analyze this PvZ lawn" }, { inline_data: { mime_type: "image/png", data: imageData } }] }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
