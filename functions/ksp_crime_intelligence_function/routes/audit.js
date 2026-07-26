import express from 'express';
import { getMockDataStore } from '../database/datastore.js';

const router = express.Router();

router.get('/', (req, res) => {
  const store = getMockDataStore();
  res.json({ auditLogs: store.auditLogs });
});

export default router;
