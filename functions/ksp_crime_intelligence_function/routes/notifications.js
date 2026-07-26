import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/:officerId', async (req, res) => {
  try {
    const officerId = req.params.officerId;
    const notificationData = await getTableData('Notification');
    
    const notifications = notificationData
      .filter(n => n.OfficerID === officerId)
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
      .slice(0, 50);

    res.json({ notifications });
  } catch (err) {
    console.error("[Notification CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch notifications from CSV: ' + (err.message || String(err)) });
  }
});

export default router;
