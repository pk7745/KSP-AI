import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/:officerId', async (req, res) => {
  try {
    const officerId = req.params.officerId;
    const activityData = await getTableData('ActivityLog');
    
    const logs = activityData
      .filter(a => a.OfficerID === officerId)
      .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))
      .slice(0, 50);

    res.json({ logs });
  } catch (err) {
    console.error("[Activity CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch activity logs from CSV: ' + (err.message || String(err)) });
  }
});

export default router;
