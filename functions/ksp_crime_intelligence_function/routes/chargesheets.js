import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const chargesheetId = req.params.id;
    const chargesheetData = await getTableData('ChargesheetDetails');
    
    const chargesheet = chargesheetData.find(c => c.ChargesheetID === chargesheetId);

    if (!chargesheet) {
      return res.status(404).json({ error: 'Chargesheet not found in CSV' });
    }

    // Join Court Data
    const courtData = await getTableData('Court');
    const court = courtData.find(c => c.CourtID === chargesheet.CourtID) || {};
    chargesheet.CourtName = court.CourtName || 'Unknown';

    res.json({ chargesheet });
  } catch (err) {
    console.error("[Chargesheet CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch chargesheet details from CSV: ' + (err.message || String(err)) });
  }
});

export default router;
