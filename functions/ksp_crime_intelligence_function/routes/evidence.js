import express from 'express';
import multer from 'multer';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/case/:caseId', async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const evidenceData = await getTableData('Evidence');
    const officerData = await getTableData('Officer');

    const evidence = evidenceData
      .filter(e => e.CaseID === caseId)
      .map(e => {
        const officer = officerData.find(o => o.OfficerID === e.CollectedOfficerID) || {};
        return {
          ...e,
          CollectedBy: officer.OfficerName || 'Unknown'
        };
      });

    res.json({ evidence });
  } catch (err) {
    console.error("[Evidence GET CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch evidence from CSVs: ' + (err.message || String(err)) });
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { caseId, officerId, evidenceType, description } = req.body;
    
    // Simulate successful Stratus upload for Datathon
    const randomId = Math.floor(Math.random() * 1000000000);
    
    res.json({ 
      success: true, 
      message: 'Evidence successfully uploaded (Simulated for CSV Engine)',
      data: {
        EvidenceID: `EVD-${randomId}`,
        StratusFileID: randomId,
        EvidenceType: evidenceType,
        Description: description,
        CaseMasterID: caseId
      }
    });
  } catch (err) {
    console.error("[Evidence POST CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to upload evidence: ' + (err.message || String(err)) });
  }
});

export default router;
