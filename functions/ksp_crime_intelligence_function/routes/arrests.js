import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const arrestId = req.params.id;
    const arrestsData = await getTableData('ArrestSurrender');
    
    const arrest = arrestsData.find(a => a.ArrestSurrenderID === arrestId);

    if (!arrest) {
      return res.status(404).json({ error: 'Arrest record not found in CSV' });
    }

    // Join Officer Data
    const officersData = await getTableData('Officer');
    const officer = officersData.find(o => o.OfficerID === arrest.ArrestingOfficerID) || {};
    
    arrest.ArrestingOfficerName = officer.OfficerName || 'Unknown';

    res.json({ arrest });
  } catch (err) {
    console.error("[Arrest CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch arrest details from CSV: ' + (err.message || String(err)) });
  }
});

export default router;
