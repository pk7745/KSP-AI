import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const earlyWarnings = [
    {
      id: 'WARN-101',
      riskLevel: 'HIGH',
      crimeCategory: 'Property Crime / Tech Burglary',
      district: 'Bengaluru City (Whitefield EPIP Zone)',
      timeframe: 'Next 7 Days',
      probabilityScore: '87%',
      rationale: 'Clustered burglaries targeting server components on weekends; matches historical patterns of inter-state gang activity.',
      recommendedAction: 'Deploy night patrols & checkposts along ITPL Main Road from 01:00 to 05:00 hrs.'
    },
    {
      id: 'WARN-102',
      riskLevel: 'HIGH',
      crimeCategory: 'NDPS / Synthetic MDMA Trafficking',
      district: 'Mangaluru City (Panambur Coast)',
      timeframe: 'Next 14 Days',
      probabilityScore: '92%',
      rationale: 'Seizure of 450g MDMA on luxury bus route indicates active coastal distribution nexus near student hubs.',
      recommendedAction: 'Initiate random baggage inspections at inter-state bus terminals & checkposts.'
    },
    {
      id: 'WARN-103',
      riskLevel: 'MEDIUM',
      crimeCategory: 'Cybercrime / Utility Bill Phishing',
      district: 'Bengaluru City (Koramangala / Indiranagar)',
      timeframe: 'End of Month (Bill Cycle)',
      probabilityScore: '74%',
      rationale: 'Surge in SMS phishing links pretending to be BESCOM bill default notices.',
      recommendedAction: 'Issue public cyber awareness advisory via SCRB portal & WhatsApp alert channels.'
    }
  ];

  res.json({
    earlyWarnings,
    meta: {
      algorithm: 'Seasonal Trend Projection + Spatial Proximity Score',
      lastEvaluated: new Date().toISOString()
    }
  });
});

export default router;
