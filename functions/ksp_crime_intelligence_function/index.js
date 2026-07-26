import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import chatRoutes from './routes/chat.js';
import dashboardRoutes from './routes/dashboard.js';
import casesRoutes from './routes/cases.js';
import analyticsRoutes from './routes/analytics.js';
import networkRoutes from './routes/network.js';
import predictRoutes from './routes/predict.js';
import auditRoutes from './routes/audit.js';
import exportPdfRoutes from './routes/exportPdf.js';
import searchRoutes from './routes/search.js';
import authRoutes from './routes/auth.js';
import evidenceRoutes from './routes/evidence.js';
import officerRoutes from './routes/officer.js';
import peopleRoutes from './routes/people.js';
import arrestsRoutes from './routes/arrests.js';
import chargesheetsRoutes from './routes/chargesheets.js';
import notificationsRoutes from './routes/notifications.js';
import activityRoutes from './routes/activity.js';
import speechRoutes from './routes/speech.js';

import { authenticate, authorizeJurisdiction } from './middleware/auth.js';

dotenv.config();

const app = express();

// Conditionally enable CORS only for local testing, 
// because Catalyst automatically injects it in production.
if (!process.env.X_ZOHO_CATALYST_LISTEN_PORT) {
  app.use(cors());
}

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'KSP AppSail Crime Intelligence', time: new Date().toISOString() });
});

// API Routes
app.use('/auth', authRoutes); // Auth routes are unprotected (except for specific endpoints handled internally)

// Protected Routes Middleware Chain
const protectedChain = [authenticate, authorizeJurisdiction];

app.use('/chat', protectedChain, chatRoutes);
app.use('/dashboard', protectedChain, dashboardRoutes);
app.use('/cases', protectedChain, casesRoutes);
app.use('/analytics', protectedChain, analyticsRoutes);
app.use('/network', protectedChain, networkRoutes);
app.use('/predict', protectedChain, predictRoutes);
app.use('/audit', protectedChain, auditRoutes);
app.use('/export/pdf', protectedChain, exportPdfRoutes);
app.use('/search', protectedChain, searchRoutes);
app.use('/evidence', protectedChain, evidenceRoutes);
app.use('/officer', protectedChain, officerRoutes);
app.use('/people', protectedChain, peopleRoutes);
app.use('/arrests', protectedChain, arrestsRoutes);
app.use('/chargesheets', protectedChain, chargesheetsRoutes);
app.use('/notifications', protectedChain, notificationsRoutes);
app.use('/activity', protectedChain, activityRoutes);
app.use('/speech', speechRoutes);
app.use('/api/speech', speechRoutes);

const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[KSP BACKEND] AppSail function listening on port ${PORT}`);
});
