import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  const { conversation = [], officerName = 'Inspector (SCRB)', sessionTitle = 'Crime Intelligence Dossier' } = req.body;

  // Metadata response for PDF generation
  res.json({
    success: true,
    documentTitle: `KSP SCRB Report - ${sessionTitle}`,
    generatedAt: new Date().toISOString(),
    officer: officerName,
    entriesCount: conversation.length,
    watermark: 'KARNATAKA STATE POLICE - CONFIDENTIAL'
  });
});

export default router;
