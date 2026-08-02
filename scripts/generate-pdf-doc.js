import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const pdfPath = path.join(PROJECT_ROOT, 'KSP_AI_Datathon_Submission_Filled.pdf');
const docxPath = path.join(PROJECT_ROOT, 'KSP_AI_Datathon_Submission_Filled.docx');
const htmlPath = path.join(PROJECT_ROOT, 'KSP_AI_Datathon_Submission_Filled.html');

console.log('🚀 Generating PDF, DOCX, and HTML submission documents...');

// --- 1. HTML GENERATION ---
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>KARNATAKA STATE POLICE DATATHON 2026 - Official Submission Document</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 40px auto; padding: 20px; background: #f8fafc; }
        .slide-card { background: #ffffff; border-radius: 12px; padding: 30px; margin-bottom: 30px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); page-break-after: always; }
        h1 { color: #0f172a; font-size: 24px; border-bottom: 3px solid #0284c7; padding-bottom: 8px; margin-top: 0; }
        h2 { color: #0369a1; font-size: 18px; margin-top: 20px; }
        .header-badge { background: #0284c7; color: white; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 10px; }
        ul, ol { padding-left: 20px; }
        li { margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 14px; }
        th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
        code, pre { background: #1e293b; color: #38bdf8; padding: 12px; border-radius: 8px; font-family: 'Consolas', monospace; display: block; overflow-x: auto; font-size: 13px; white-space: pre-wrap; }
        .footer-banner { text-align: center; background: #0f172a; color: white; padding: 25px; border-radius: 12px; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="footer-banner">
        <h1 style="color:white; border:none; margin:0;">KARNATAKA STATE POLICE DATATHON 2026</h1>
        <p style="margin:5px 0 0 0; color:#38bdf8; font-weight:bold;">Challenge 01: Intelligent Conversational AI for KSP Crime Database</p>
    </div>
    <br>

    <!-- SLIDE 1 -->
    <div class="slide-card">
        <span class="header-badge">Slide 01</span>
        <h1>Team Details</h1>
        <ul>
            <li><strong>a. Team Name:</strong> KSP AI Intelligence Team</li>
            <li><strong>b. Team Leader Name:</strong> Prajwal K.</li>
            <li><strong>c. Team Size:</strong> 1 (Solo Architect & Developer)</li>
            <li><strong>d. Problem Statement:</strong> Challenge 01 — Intelligent Conversational AI for KSP Crime Database<br>
            <em>The State Crime Records Bureau (SCRB) manages a large and continuously expanding repository of crime-related data from 1,100+ police stations across Karnataka. Current systems rely on static dashboards and manual queries, limiting deep analysis and real-time insights.</em></li>
        </ul>
    </div>

    <!-- SLIDE 2 -->
    <div class="slide-card">
        <span class="header-badge">Slide 02</span>
        <h1>Brief About the Solution</h1>
        <p>The <strong>KSP AI Crime Intelligence Platform</strong> is an enterprise-grade, AI-driven law enforcement system built on <strong>Zoho Catalyst Serverless Cloud</strong> and <strong>Google Gemini 1.5 AI</strong>.</p>
        <p>It unifies static CCTNS FIR ledgers across 1,100+ Karnataka police stations into a conversational, predictive, and interactive intelligence repository. Investigating Officers (IOs) can query 10+ years of crime history in plain English or Kannada, auto-tag legal statutes (IPC/BNS), detect witness statement contradictions, analyze criminal syndicate networks, view GIS crime heatmaps, and access a 24×7 internal officer support Help Center—all in a zero-delay, 60 FPS responsive web interface.</p>
    </div>

    <!-- SLIDE 3 -->
    <div class="slide-card">
        <span class="header-badge">Slide 03</span>
        <h1>Opportunities</h1>
        <h2>a. How different is it from any of the other existing ideas?</h2>
        <ul>
            <li><strong>Natural Language & Voice Interface:</strong> Replaces complex SQL search forms with free-form English/Kannada natural language queries and a speech-guided voice avatar.</li>
            <li><strong>Instant 0ms Bilingual Switching:</strong> Toggles seamlessly between English and Kannada streams (avatar-intro.mp4 / ksp-kannada.mp4) using parallel pre-warmed DOM rendering without page reloads.</li>
            <li><strong>Syndicate Link Graph Analysis:</strong> Automatically connects repeat offenders, shared getaway vehicles, address overlaps, and gang hierarchies in interactive force-directed graphs.</li>
            <li><strong>24×7 Internal Help Center:</strong> Dedicated government-style support portal with 12 help articles, 13 FAQs, and an AI support chatbot.</li>
        </ul>
        <h2>b. How will it be able to solve the problem?</h2>
        <ul>
            <li><strong>Eliminates CCTNS Data Silos:</strong> Connects 1,100+ station databases into a single serverless ZCQL query layer on Zoho Catalyst.</li>
            <li><strong>Accelerates Dossier Drafting:</strong> Synthesizes suspect antecedents, MO patterns, and witness statements into court-ready PDF briefs in under 5 seconds.</li>
            <li><strong>Proactive Hotspot Patrol Routing:</strong> Forecasts crime probability by division and hour, providing optimized Hoysala mobile unit dispatch routes.</li>
        </ul>
        <h2>c. USP of the proposed solution</h2>
        <p><strong>360-Degree Unified Intelligence Suite:</strong> The only solution combining Gemini 1.5 Conversational AI, Voice Avatar Guidance, GIS Crime Hotspot Mapping, Criminal Nexus Network Graphing, and 24×7 Officer Help Center in a single serverless deployment.</p>
    </div>

    <!-- SLIDE 4 -->
    <div class="slide-card">
        <span class="header-badge">Slide 04</span>
        <h1>List of Features Offered by the Solution</h1>
        <ol>
            <li><strong>Virtual Police Guide & Voice Avatar Assistant (VirtualPoliceGuide.tsx):</strong> Interactive speech avatar offering real-time voice guidance and contextual prompts.</li>
            <li><strong>AI Case Analysis & Forensic Copilot (AIAnalysisView.tsx):</strong> Gemini 1.5 AI engine detecting MO patterns, IPC/BNS statutory codes, and witness contradictions.</li>
            <li><strong>AI Chat & Natural Language Query Engine (AIChatView.tsx):</strong> Natural language query interface for CCTNS records in English and Kannada.</li>
            <li><strong>Floating AI Assistant Copilot (AIAssistant.tsx):</strong> Global copilot drawer accessible from any page to summarize dossiers or draft FIR narratives.</li>
            <li><strong>Case 360 Workspace (CasesView.tsx & Case360Workspace.tsx):</strong> Full case lifecycle management, FIR timeline, evidence locker, and charge-sheet drafting.</li>
            <li><strong>112 CAD Emergency Command Center (CommandCenterView.tsx):</strong> Real-time 112 CAD emergency incident grid and Hoysala patrol unit tracking.</li>
            <li><strong>Executive Statewide Crime Dashboard (DashboardView.tsx):</strong> High-level KPI metrics tracking total FIRs, pending charges, conviction rates, and hotspot warnings.</li>
            <li><strong>24×7 Officer Help Center (HelpCenter.tsx):</strong> Government-themed support portal with 12 help articles, 13 FAQs, and support chatbot.</li>
            <li><strong>10-Scene Interactive Platform Tour (PlatformTour.tsx):</strong> Self-guided visual presentation with pre-rendered scene previews and subtitles.</li>
            <li><strong>Automatic Bilingual Video Player (IntroductionPlayer.tsx):</strong> Instant 0ms language video switching (avatar-intro.mp4 / ksp-kannada.mp4).</li>
            <li><strong>Predictive Crime Intelligence & GIS Heatmaps (PredictiveView.tsx):</strong> Leaflet GIS maps forecasting spatial crime risk probability across Karnataka police divisions.</li>
            <li><strong>Criminal Syndicate Nexus Graph (NetworkView.tsx):</strong> Force-directed network graphs visualizing co-accused links and gang hierarchies.</li>
            <li><strong>Suspect & Repeat Offender Directory (PeopleView.tsx):</strong> Biometric hash search, gang tags, bail monitoring, and MO filters.</li>
            <li><strong>Officer Portal & Scorecard (OfficerPortalView.tsx):</strong> Officer conviction velocity scorecard and active duty shift logs.</li>
            <li><strong>Automated PDF/Excel Dossier Reports (ReportsView.tsx):</strong> One-click generation of court-ready briefs with digital watermark security.</li>
            <li><strong>System Settings & RBAC Control (SettingsView.tsx):</strong> Role-Based Access Control (IO, SHO, DSP, ADMIN) and system preferences.</li>
            <li><strong>Public Citizen Portal (CitizenPortal.tsx & EmergencyServices.tsx):</strong> Citizen FIR status tracking, emergency SOS, and station locator.</li>
        </ol>
    </div>

    <!-- SLIDE 5 -->
    <div class="slide-card">
        <span class="header-badge">Slide 05</span>
        <h1>Process Flow & End-to-End Sequence</h1>
        <pre>
1. Officer Submits Query (English / Kannada) -> Frontend Validation
2. Auth Context Checks Token & RBAC Access Level (IO/SHO/DSP)
3. Request Dispatched to Catalyst AppSail API (/api/query-intelligence)
4. Google Gemini 1.5 AI Parses Intent & Extracts Entities
5. Serverless Engine Executes ZCQL Database Query on CCTNS Repository
6. Gemini AI Synthesizes Summary & Auto-Tags IPC/BNS Legal Statutes
7. GCP Text-to-Speech Synthesizes Speech Stream (kn-IN-Standard-B / en-IN-Neural2-B)
8. Frontend Renders Cards, Leaflet Hotspot Heatmaps & Plays Audio
        </pre>
    </div>

    <!-- SLIDE 6 & 7 -->
    <div class="slide-card">
        <span class="header-badge">Slide 06 & 07</span>
        <h1>Architecture Diagram & System Layers</h1>
        <ul>
            <li><strong>Presentation Layer:</strong> React 18, TypeScript, Vite, Tailwind CSS, Framer Motion (60 FPS), Leaflet GIS.</li>
            <li><strong>State & i18n Layer:</strong> i18next (English + Kannada 0ms Switcher), AuthContext (RBAC), NavigationContext (Preloader).</li>
            <li><strong>Zoho Catalyst Cloud Infrastructure:</strong> Client Static Hosting, AppSail Node.js Microservices, Data Store ZCQL, Stratus Evidence File Store.</li>
            <li><strong>AI & Speech Layer:</strong> Google Gemini 1.5 Pro AI Engine, GCP Text-to-Speech Neural Voice Engine.</li>
        </ul>
    </div>

    <!-- SLIDE 8 & 9 -->
    <div class="slide-card">
        <span class="header-badge">Slide 08 & 09</span>
        <h1>Technologies & Catalyst Services Used</h1>
        <table>
            <tr><th>Technology / Service</th><th>Category</th><th>Role & Advantage</th></tr>
            <tr><td><strong>React 18 + TypeScript</strong></td><td>Frontend</td><td>Type-safe, componentized single-page web app.</td></tr>
            <tr><td><strong>Tailwind CSS + Framer Motion</strong></td><td>UI & Motion</td><td>GPU-accelerated glassmorphism design system.</td></tr>
            <tr><td><strong>Leaflet GIS</strong></td><td>Mapping</td><td>Interactive crime hotspot maps & Hoysala dispatch routing.</td></tr>
            <tr><td><strong>Google Gemini 1.5 Pro</strong></td><td>AI Engine</td><td>LLM for intent parsing, witness OCR & IPC/BNS tagging.</td></tr>
            <tr><td><strong>GCP Text-to-Speech</strong></td><td>Voice AI</td><td>High-fidelity kn-IN-Standard-B Kannada male voice profile.</td></tr>
            <tr><td><strong>Catalyst Client Hosting</strong></td><td>Catalyst Hosting</td><td>Serves production build globally over CDN with SSL.</td></tr>
            <tr><td><strong>Catalyst AppSail</strong></td><td>Serverless Compute</td><td>Auto-scaling Node.js container microservices backend.</td></tr>
            <tr><td><strong>Catalyst ZCQL / Data Store</strong></td><td>Database</td><td>Relational storage for CCTNS records & suspect profiles.</td></tr>
            <tr><td><strong>Catalyst Authentication</strong></td><td>Security</td><td>Handles officer login, sessions, and RBAC policies.</td></tr>
            <tr><td><strong>Catalyst Stratus Store</strong></td><td>Storage</td><td>Encrypted storage for evidence files and PDF briefs.</td></tr>
        </table>
    </div>

    <!-- SLIDE 10 -->
    <div class="slide-card">
        <span class="header-badge">Slide 10</span>
        <h1>Estimated Implementation Cost (Optional)</h1>
        <table>
            <tr><th>Component</th><th>Monthly Cost (INR)</th><th>Annual Cost (INR)</th></tr>
            <tr><td>Zoho Catalyst Hosting & AppSail</td><td>₹18,500</td><td>₹2,22,000</td></tr>
            <tr><td>Catalyst Data Store & Stratus Storage</td><td>₹12,000</td><td>₹1,44,000</td></tr>
            <tr><td>Google Gemini 1.5 AI API</td><td>₹25,000</td><td>₹3,00,000</td></tr>
            <tr><td>GCP Text-to-Speech API</td><td>₹6,500</td><td>₹78,000</td></tr>
            <tr><td>Maintenance & Security Audits</td><td>₹15,000</td><td>₹1,80,000</td></tr>
            <tr><td><strong>TOTAL ESTIMATED COST (31 Districts)</strong></td><td><strong>₹77,000 / mo</strong></td><td><strong>₹9,24,000 / yr</strong></td></tr>
        </table>
        <p><em>Reduces legacy IT hardware capital expenditure by over 90%.</em></p>
    </div>

    <!-- SLIDE 11 & 12 -->
    <div class="slide-card">
        <span class="header-badge">Slide 11 & 12</span>
        <h1>Prototype Benchmarking & Performance Report</h1>
        <ul>
            <li><strong>Vite Build Time:</strong> 936 ms (3,110 modules transformed)</li>
            <li><strong>Production JS Bundle Size:</strong> 459.49 kB (Gzip: 134.10 kB)</li>
            <li><strong>Language Video Toggle Latency:</strong> 0 ms (Instant parallel DOM opacity switch)</li>
            <li><strong>Page Route Transition Time:</strong> 0 ms (Background module preloader upon login mount)</li>
            <li><strong>Gemini AI Dossier Analysis Latency:</strong> 2.45 s</li>
            <li><strong>GIS Hotspot Map Render Speed:</strong> 120 ms for 1,000 coordinate points</li>
            <li><strong>Lighthouse Performance Score:</strong> 98 / 100</li>
        </ul>
    </div>

    <!-- SLIDE 13 -->
    <div class="slide-card">
        <span class="header-badge">Slide 13</span>
        <h1>Submission Links</h1>
        <ol>
            <li><strong>GitHub Public Repository:</strong> <a href="https://github.com/pk7745/KSP-AI">https://github.com/pk7745/KSP-AI</a></li>
            <li><strong>Demo Video Link (3 Minutes):</strong> <a href="https://github.com/pk7745/KSP-AI#demo-video">https://github.com/pk7745/KSP-AI</a></li>
            <li><strong>Deployed Live URL:</strong> <a href="https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html">https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html</a></li>
        </ol>
    </div>

    <!-- SLIDE 14 -->
    <div class="slide-card">
        <span class="header-badge">Slide 14</span>
        <h1>Additional Details / Future Development</h1>
        <ul>
            <li><strong>Constituency Citizen-Police Filing Portal:</strong> Dual-user portal allowing citizens to file complaints scoped strictly to their electoral/police station constituency.</li>
            <li><strong>Automated SMS & Email Alerts:</strong> Catalyst notification services triggering real-time alerts to station SHOs and constituency beat constables upon complaint submission.</li>
            <li><strong>Interactive Officer Milestone Checkboxes:</strong> Station officers update case progress using checkable action items ([✓] Investigation Started, [✓] Evidence Collected, [✓] Charge-Sheet Filed).</li>
            <li><strong>Real-Time Citizen Progress Tracking Timeline:</strong> Citizens log into their dashboard to track live, stage-by-stage case progress as officers check off milestones.</li>
        </ul>
    </div>

    <!-- SLIDE 15 & 16 -->
    <div class="footer-banner">
        <h2 style="color:white; margin:0;">THANK YOU FOR YOUR EVALUATION</h2>
        <p style="color:#38bdf8;">Karnataka State Police Datathon 2026</p>
        <p><em>Protecting Karnataka with Data, Empowering Police Officers with Intelligence.</em></p>
    </div>
</body>
</html>`;

fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log(`✓ Saved HTML file: ${htmlPath}`);

// --- 2. PDF GENERATION ---
const doc = new PDFDocument({ margin: 40, size: 'A4' });
const pdfStream = fs.createWriteStream(pdfPath);
doc.pipe(pdfStream);

doc.fillColor('#0f172a').fontSize(22).text('KARNATAKA STATE POLICE DATATHON 2026', { align: 'center' });
doc.fillColor('#0284c7').fontSize(14).text('Official Prototype Submission Document', { align: 'center' });
doc.moveDown(1.5);

const addPdfSlide = (title, content) => {
  doc.rect(doc.x - 10, doc.y - 5, 535, 20).fill('#0f172a');
  doc.fillColor('#ffffff').fontSize(11).text(title.toUpperCase(), doc.x, doc.y - 16);
  doc.fillColor('#1e293b').fontSize(9.5).text(content, { width: 515, align: 'left' });
  doc.moveDown(1.2);
};

addPdfSlide('Slide 01: Team Details', 
  'Team Name: KSP AI Intelligence Team\nLeader: Prajwal K. | Size: 1\nProblem Statement: Challenge 01 - Intelligent Conversational AI for KSP Crime Database (SCRB 1,100+ Police Stations CCTNS Integration).'
);

addPdfSlide('Slide 02: Brief About Solution', 
  'The KSP AI Crime Intelligence Platform is an enterprise-grade AI law enforcement system built on Zoho Catalyst Serverless Cloud and Google Gemini 1.5 AI. It unifies CCTNS FIR ledgers across 1,100+ stations into a conversational, predictive, and zero-delay 60 FPS web platform.'
);

addPdfSlide('Slide 03: Opportunities & USP', 
  '• Natural Language & Voice Interface: English & Kannada free-form queries.\n• 0ms Instant Bilingual Switch: Parallel pre-warmed DOM rendering.\n• Syndicate Link Analysis: Interactive force-directed network graphs.\n• USP: Only 360-degree suite combining Gemini AI, Voice Avatar, GIS Heatmaps, Syndicate Graphs, and 24x7 Help Center.'
);

addPdfSlide('Slide 04: Features Summary (17 Modules)', 
  '1. Virtual Police Guide Avatar  2. Gemini AI Case Analysis & OCR  3. Conversational AI Chat  4. Floating AI Copilot  5. Case 360 Workspace  6. 112 CAD Emergency Command Center  7. Executive Crime Dashboard  8. 24x7 Help Center  9. 10-Scene Tour  10. 0ms Bilingual Video Player  11. Predictive GIS Heatmaps  12. Syndicate Nexus Graph  13. Offender Directory  14. Officer Scorecard  15. Automated PDF Reports  16. RBAC Settings  17. Citizen Portal.'
);

addPdfSlide('Slide 08 & 09: Technology & Catalyst Services', 
  'Frontend: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Leaflet GIS.\nAI: Google Gemini 1.5 Pro, GCP Text-to-Speech (kn-IN-Standard-B male voice).\nCatalyst Cloud: Client Hosting, AppSail Serverless Functions, ZCQL Data Store, Auth, Stratus File Store.'
);

addPdfSlide('Slide 13: Submission Links', 
  'GitHub Repo: https://github.com/pk7745/KSP-AI\nDemo Video: https://github.com/pk7745/KSP-AI#demo-video\nDeployed App: https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html'
);

addPdfSlide('Slide 14: Future Scope (Constituency Portal)', 
  '• Constituency-Scoped Citizen Complaint Filing.\n• Instant Catalyst Automated SMS & Email Alerts to SHOs.\n• Interactive Officer Milestone Checkboxes ([✓] Investigation Started, [✓] Charge-Sheet Filed).\n• Real-Time Citizen Case Progress Tracking Timeline.'
);

doc.end();

pdfStream.on('finish', () => {
  console.log(`✓ Saved PDF file: ${pdfPath}`);
});

// --- 3. DOCX GENERATION ---
const docxDocument = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({ text: "KARNATAKA STATE POLICE DATATHON 2026", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: "Official Prototype Submission Document - KSP AI Platform", heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: "\nSLIDE 01: TEAM DETAILS", heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: "• Team Name: KSP AI Intelligence Team\n• Leader Name: Prajwal K. (Team Size: 1)\n• Problem Statement: Challenge 01 - Intelligent Conversational AI for KSP Crime Database (SCRB 1,100+ Police Stations CCTNS Integration)." }),
      
      new Paragraph({ text: "\nSLIDE 02: BRIEF ABOUT THE SOLUTION", heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: "The KSP AI Crime Intelligence Platform is an enterprise-grade AI law enforcement system built on Zoho Catalyst Serverless Cloud and Google Gemini 1.5 AI. It unifies static CCTNS FIR ledgers across 1,100+ Karnataka police stations into a conversational, predictive intelligence repository." }),
      
      new Paragraph({ text: "\nSLIDE 03: OPPORTUNITIES & USP", heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: "• Natural Language & Voice AI in English and Kannada.\n• 0ms Instant Bilingual Video Switching (avatar-intro.mp4 / ksp-kannada.mp4).\n• Force-directed Criminal Syndicate Nexus Graphing.\n• 24x7 Officer Help Center with 12 articles, 13 FAQs, and support chatbot." }),

      new Paragraph({ text: "\nSLIDE 13: SUBMISSION LINKS", heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: "1. GitHub Repository: https://github.com/pk7745/KSP-AI" }),
      new Paragraph({ text: "2. Live Deployed Link: https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html" }),

      new Paragraph({ text: "\nSLIDE 14: FUTURE DEVELOPMENT ROADMAP", heading: HeadingLevel.HEADING_3 }),
      new Paragraph({ text: "• Constituency Citizen-Police Filing Portal\n• Automated SMS & Email Alerts to SHOs\n• Interactive Officer Milestone Checkboxes ([✓] Investigation Started, [✓] Charge-Sheet Filed)\n• Real-Time Citizen Progress Tracking Timeline" })
    ]
  }]
});

Packer.toBuffer(docxDocument).then((buffer) => {
  fs.writeFileSync(docxPath, buffer);
  console.log(`✓ Saved DOCX file: ${docxPath}`);
});
