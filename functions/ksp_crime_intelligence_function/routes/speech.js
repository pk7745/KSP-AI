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
    console.warn('[Speech Route Warning] GCP TTS unavailable, returning fallback status:', err.message);
    return res.status(200).json({ fallback: true, message: 'Google TTS unavailable, fallback to Web Speech API' });
  }
});

export default router;
