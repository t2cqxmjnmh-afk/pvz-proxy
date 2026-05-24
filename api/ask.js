export default async function handler(req, res) {
  const { imageData, prompt } = req.body;
  
  if (!imageData || !prompt) {
    return res.status(400).json({ error: "Missing imageData or prompt" });
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
