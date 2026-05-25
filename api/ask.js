export default async function handler(req, res) {
  const { imageData, prompt } = req.body;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  if (!imageData || !prompt) {
    return res.status(400).json({ error: "Missing imageData or prompt" });
  }
  
  if (Buffer.byteLength(imageData) > 10 * 1024 * 1024) {
    return res.status(400).json({ error: "Image too large" });
  }
  
  if (prompt.length > 10000) {
    return res.status(400).json({ error: "Prompt too long" });
  }
  const apiKey = process.env.API_KEY;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        parts: [
          { text: prompt }, 
          { inline_data: { mime_type: "image/png", data: imageData } }
        ] 
      }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
