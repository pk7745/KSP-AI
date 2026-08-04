import express from 'express';
import { generateSpeech } from '../services/speechService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text string parameter is required.' });
    }

    const audioBuffer = await generateSpeech(text, language);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    return res.send(audioBuffer);
  } catch (err) {
    console.error('[Speech Route Error]:', err.message);
    return res.status(500).json({ error: 'Speech synthesis failed: ' + err.message });
  }
});

export default router;
