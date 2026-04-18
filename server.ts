import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API Initialization
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  // Humanize API Route
  app.post('/api/humanize', async (req, res) => {
    try {
      const { text, tone = 'natural' } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const systemPrompt = `You are an expert human writer specializing in bypassing AI detection. 
      Your goal is to rewrite the provided text to sound completely human, natural, and engaging.
      
      Key principles to follow for "Humanization":
      1. **Burstiness**: Vary sentence structure and length significantly. Some sentences should be short and punchy, while others should be longer and more complex.
      2. **Perplexity**: Avoid predictable word sequences. Use synonyms and phrasing that a human would naturally use, which might be slightly less "perfect" than AI.
      3. **Voice & Tone**: Use a ${tone} tone. Use contractions (e.g., "don't" instead of "do not") and idiomatic expressions where appropriate.
      4. **Imperfections**: Occasionally use soft transitions or slightly informal phrasing if it fits the context.
      5. **Banned Words**: Do not use typical AI transition words like "Furthermore", "Moreover", "In conclusion", "Additionally" unless absolutely necessary. Use more natural transitions like "Also", "But", "So", "To wrap up".
      
      Output only the humanized text. Do not provide any explanations or meta-commentary.`;

      const prompt = `Humanize this text:\n\n${text}`;

      const result = await model.generateContent([
        { text: systemPrompt },
        { text: prompt }
      ]);
      const response = await result.response;
      const humanizedText = response.text();

      res.json({ result: humanizedText });
    } catch (error: any) {
      console.error('Humanize error:', error);
      res.status(500).json({ error: error.message || 'Failed to humanize text' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
