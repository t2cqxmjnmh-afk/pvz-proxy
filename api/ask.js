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
  
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const startTime = Date.now();
    console.log('Starting Gemini API call...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second limit
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ 
          parts: [
            { text: prompt }, 
            { inline_data: { mime_type: "image/png", data: imageData } }
          ] 
        }]
      })
    });

    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;
    console.log(`Gemini API responded in ${elapsed}ms`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message === 'The operation was aborted' ? "Request timeout" : "Internal server error" });
  }
}
