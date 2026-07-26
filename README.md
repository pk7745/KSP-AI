# 🚨 KSP AI Crime Intelligence Platform

> **Karnataka State Police — Statewide Crime Intelligence, AI Case Analysis & Dossier Repository**

![KSP AI Banner](webclient/src/assets/ksp-logo.svg)

---

## 🌐 Live Cloud Deployment Links

- **Main Application Entry**: [https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html](https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html)
- **24×7 Officer Help Center**: [https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/help-center](https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/help-center)
- **Interactive Platform Tour**: [https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/about-platform](https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/about-platform)
- **Backend AppSail Function**: [https://ksp-crime-intelligence-function-10128235536.development.catalystappsail.com](https://ksp-crime-intelligence-function-10128235536.development.catalystappsail.com)

---

## 📋 Overview

The **KSP AI Crime Intelligence Platform** is an enterprise-grade, AI-powered investigation system engineered for the **Karnataka State Police (KSP)**. It unifies CCTNS FIR ledgers across 31 Karnataka district jurisdictions, provides real-time 112 emergency CAD dispatch synchronization, extracts forensic evidence entities via Google Gemini AI OCR, projects spatial crime heatmaps, and constructs multi-district criminal syndicate nexus graphs.

---

## 🚀 QUICKSTART (Run Locally in Under 3 Minutes)

Copy and paste these commands into your terminal to get up and running immediately:

```bash
# 1. Clone the repository
git clone https://github.com/pk7745/KSP-AI.git
cd KSP-AI

# 2. Navigate to webclient directory and install dependencies
cd webclient
npm install

# 3. Start local development server
npm run dev
```

> 💡 **Success Output**: Your terminal will display `VITE v8.1.5 ready in XXX ms`. Open **`http://localhost:5173/`** in your browser.

---

## 📋 SYSTEM PREREQUISITES & ENVIRONMENT REQUIREMENTS

Ensure your system has the following software installed before proceeding:

| Software / Tool | Required Version | Verification Command | Official Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` or higher (`v20.x` recommended) | `node -v` | [nodejs.org](https://nodejs.org) |
| **npm** | `v9.0.0` or higher | `npm -v` | Included with Node.js |
| **Git** | `v2.30.0` or higher | `git --version` | [git-scm.com](https://git-scm.com) |
| **Zoho Catalyst CLI** | Latest *(Required for Cloud Deployment)* | `catalyst --version` | `npm install -g zcatalyst-cli` |

---

## 📖 STEP-BY-STEP DETAILED EXECUTION GUIDE

### **STEP 1: Clone the GitHub Repository**

Open PowerShell, Command Prompt, or Terminal and run:

```bash
git clone https://github.com/pk7745/KSP-AI.git
cd KSP-AI
```

---

### **STEP 2: Install Node Dependencies**

#### **1. Install Webclient Frontend Packages:**
```bash
cd webclient
npm install
```

#### **2. Install Backend AppSail Serverless Packages:**
```bash
cd ../functions/ksp_crime_intelligence_function
npm install
cd ../..
```

---

### **STEP 3: Run the Development Server Locally**

Navigate to the `webclient` directory and start the Vite development server:

```bash
cd webclient
npm run dev
```

#### **Expected Terminal Output:**
```text
  VITE v8.1.5  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Open your web browser and navigate to:  
👉 **`http://localhost:5173/`**

---

### **STEP 4: Compile & Verify Production Build**

To perform TypeScript type validation (`tsc -b`) and compile optimized static bundle chunks (`vite build`):

```bash
cd webclient
npm run build
```

#### **Expected Production Build Output (0 Errors):**
```text
> webclient@0.0.0 build
> tsc -b && vite build

vite v8.1.5 building client environment for production...
transforming...✓ 3110 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                               3.34 kB │ gzip:   0.88 kB
dist/assets/index-LiiotwBn.js               459.49 kB │ gzip: 134.10 kB

✓ built in 936ms
```

To preview the production build locally:
```bash
npm run preview
```

---

### **STEP 5: Deploy to Zoho Catalyst Cloud Hosting**

To deploy updates live to the **Zoho Catalyst Cloud Platform**:

#### **1. Log in to Zoho Catalyst CLI:**
```bash
catalyst login
```
*(A browser authentication window will open. Click "Approve" to log into your Zoho Catalyst account).*

#### **2. Deploy Webclient Static Hosting:**
```bash
catalyst deploy --only client
```

#### **Expected Deployment Output:**
```text
 >>>>>>>>>>>>> Web Client <<<<<<<<<<<<

√ DEPLOYMENT SUCCESSFUL: webclient
i ACCESS URL : https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html

√ Catalyst deploy complete!
```

#### **3. Deploy AppSail Backend Functions:**
```bash
catalyst deploy --only functions
```

#### **4. Deploy Full Application Stack (Client + Functions):**
```bash
catalyst deploy
```

---

## 🔒 ENVIRONMENT & GCP CREDENTIALS SETUP

The platform uses Google Cloud Service Account credentials for Google Gemini 1.5 Pro AI and Google Cloud Text-to-Speech synthesis.

- **File Path**: `functions/ksp_crime_intelligence_function/gcp-credentials.json`
- **Setup**: Ensure your Google Cloud Service Account key JSON file is placed at the path above when testing backend AI services locally.

> ⚠️ **Note**: `gcp-credentials.json` is excluded via `.gitignore` to prevent credential exposure on public GitHub repositories.

---

## 🔧 TROUBLESHOOTING & COMMON FIXES

### **Fix 1: PowerShell Script Execution Policy Error (Windows)**
```text
File C:\Users\...\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```
**Resolution**: Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

### **Fix 2: Port 5173 is Already Occupied**
```text
Port 5173 is in use, trying another one...
```
**Resolution**: Force Vite to run on a custom port:
```bash
npx vite --port 3000
```

---

### **Fix 3: Corrupted `node_modules` or Build Cache**
**Resolution**: Clear cache and reinstall:
```bash
cd webclient
rm -rf node_modules package-lock.json
npm install
```

---

## ✨ Complete Feature Matrix & Platform Capabilities

### 🎙️ 1. Virtual Police Guide & Voice Avatar Assistant
- **Interactive Speech Avatar (`VirtualPoliceGuide.tsx`)**: Embedded virtual police officer guide offering contextual speech bubbles and voice guidance for investigating officers.
- **Smart Contextual Greetings (`useVirtualGuide.ts`)**: Time-aware greetings and speech prompts tailored to active officer workflows.
- **Bilingual Voice Guidance**: Real-time narration delivered in English and Kannada across application views.

### 🧠 2. AI Case Analysis & Forensic Investigative Copilot
- **Deep Gemini AI Dossier Analysis (`AIAnalysisView.tsx`)**: Powered by Google Gemini 1.5 AI to detect modus operandi patterns, cross-reference historical FIRs, and identify witness statement inconsistencies.
- **IPC & BNS Statutory Auto-Tagging**: Instant mapping of case details to IPC (Indian Penal Code) & BNS (Bharatiya Nyaya Sanhita) legal sections.
- **AI Forensic Evidence OCR**: Scans physical evidence, handwritten FIRs, forensic lab notes, bank statements, and ID documents to auto-populate structured entity fields.

### 💬 3. AI Chat & Natural Language Query Engine
- **Conversational Database Search (`AIChatView.tsx`)**: Query CCTNS records using natural language (e.g., *"Find all commercial burglaries in Whitefield involving blue motorbikes in the last 6 months"*).
- **Interactive Query Prompts**: Pre-built prompt buttons for rapid crime trend analysis and suspect pattern matching.

### 🤖 4. Floating AI Assistant Copilot
- **Global Assistant Panel (`AIAssistant.tsx`)**: Accessible from any view (`useAssistant.ts`) to summarize active dossiers, draft FIR narratives, or retrieve suspect antecedents instantly.

### 📁 5. Case 360 Workspace & Dossier Repository
- **360-Degree Case Lifecycle (`CasesView.tsx` & `Case360Workspace.tsx`)**: Complete case tracking including FIR timeline, evidence chain-of-custody, charge-sheet draft status, and suspect interrogation logs.

### 🚨 6. Emergency Command Center & 112 CAD Dispatch Grid
- **Real-Time Incident Grid (`CommandCenterView.tsx`)**: Monitor incoming 112 emergency CAD calls, prioritize high-severity dispatch events, and track Hoysala patrol unit response times.

### 📊 7. Executive Statewide Crime Dashboard
- **Real-Time Crime Analytics (`DashboardView.tsx`)**: High-level metrics tracking total registered FIRs, pending charge-sheets, conviction rates, and active hotspot warnings across Karnataka jurisdictions.

### 🛟 8. 24×7 Officer Help Center
- **Internal Support Assistant (`HelpCenter.tsx`)**: Government-themed support assistant answering platform queries 24/7.
- **Official Helpdesk Contacts**: Direct email (`karnataka@ksp.gov.in`) and phone (`+91 80 2345 6789`) support channels.
- **Knowledge Base**: 12 step-by-step help articles and 13 interactive FAQ accordions.

### 🎮 9. 10-Scene Interactive Platform Tour
- **Guided Platform Demonstration (`PlatformTour.tsx`)**: 10-scene interactive showcase highlighting core modules with synchronized scene audio previews and subtitles.

### 🎬 10. Automatic Bilingual Introduction Video Player
- **Preloaded Video Player (`IntroductionPlayer.tsx`)**: Instant 0ms language video switching between English (`avatar-intro.mp4`) and Kannada (`ksp-kannada.mp4`).

### 🗺️ 11. Predictive Crime Intelligence & GIS Spatial Mapping
- **Spatial Heatmaps (`PredictiveView.tsx`)**: Interactive Leaflet GIS maps visualizing crime density across Bengaluru, Mysuru, Mangaluru, Belagavi, and Hubballi-Dharwad.

### 🕸️ 12. Criminal Syndicate Nexus Graph
- **Network Link Analysis (`NetworkView.tsx`)**: Force-directed network graphs revealing co-accused connections, shared getaway vehicles, address overlaps, and syndicate leadership hierarchies.

### 👤 13. Suspect & Repeat Offender Directory
- **Biometric & Antecedent Profiling (`PeopleView.tsx`)**: Searchable offender directory with gang affiliation tagging, modus operandi filters, bail monitoring, and conviction history.

### 🎖️ 14. Officer Portal & Performance Scorecard
- **Officer Scorecard (`OfficerPortalView.tsx`)**: Track case closure velocity, pending investigation queues, commendation badges, and active duty shift logs.

### 📑 15. Automated Reports & Judicial Dossier Export
- **Court-Ready PDF & Excel Briefs (`ReportsView.tsx`)**: One-click generation of prosecution dossiers with embedded official KSP emblem watermarks.

### ⚙️ 16. System Settings & Role-Based Security
- **RBAC Management (`SettingsView.tsx`)**: System preferences, theme customization, language switching, and Role-Based Access Control (`IO`, `SHO`, `DSP`, `ADMIN`).

### 🏛️ 17. Public Citizen Portal & Emergency Services
- **Public Portal (`CitizenPortal.tsx` & `EmergencyServices.tsx`)**: Citizen FIR status tracking, emergency SOS button, and nearest police station locator.

---

## 🔮 Future Development Roadmap

### 🏛️ Unified Citizen-Police Constituency Portal & Real-Time Tracking
1. **Constituency-Scoped Citizen Filing**: Citizens and officers utilize the same platform under unified RBAC. Citizens can file complaints scoped strictly to their registered electoral or police station constituency.
2. **Instant Automated SMS & Email Alerts**: Upon complaint filing, Catalyst Email/SMS Notify services instantly alert assigned Station House Officers (SHOs) and Constituency Beat Officers.
3. **Interactive Investigation Milestone Checkboxes**: Officers log into their dashboard to check off live investigation milestones:
   - `[✓] Complaint Verified & Ingested`
   - `[✓] Investigating Officer (IO) Assigned`
   - `[✓] On-Site Investigation Started`
   - `[✓] Evidence & Witness Records Collected`
   - `[✓] Final Charge-Sheet Submitted`
4. **Live Citizen Case Tracking Timeline**: Citizens log in to view real-time stage-by-stage progress tracking of their complaint as officers check off milestones.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Glassmorphism CSS |
| **Animations** | Framer Motion (GPU Hardware Accelerated) |
| **Mapping & GIS** | Leaflet, React-Leaflet, CartoDB Light basemaps |
| **Internationalization** | i18next, react-i18next (English & Kannada) |
| **AI & LLM Services** | Google Gemini 1.5 Pro / Flash AI API |
| **Speech & Audio** | Google Cloud Text-to-Speech (`@google-cloud/text-to-speech`) |
| **Backend & Hosting** | Zoho Catalyst Serverless Web Client & AppSail Node.js Functions |

---

## 📂 Project Directory Structure

```text
ksp-ai/
├── client/                     # Zoho Catalyst Client Distribution
├── functions/                  # Zoho Catalyst Backend Serverless Functions
│   └── ksp_crime_intelligence_function/
│       ├── gcp-credentials.json # GCP Service Account Credentials
│       ├── index.js             # Main Backend Server Entry
│       ├── package.json
│       └── services/
│           ├── gemini.js        # Google Gemini AI Integration Engine
│           └── zcqlService.js   # Zoho Catalyst ZCQL Database Adapter
├── public/                     # Static Root Media & Intro Audio Assets
│   └── intro/audio/
│       ├── en/intro.mp3        # English Male Intro Narration
│       └── kn/intro.mp3        # Kannada Male Intro Narration
├── scripts/                    # Offline TTS & Dataset Expansion Scripts
│   ├── generate-intro-tts.js   # Intro Speech Generator Script
│   └── generate-narration-tts.js # Scene Narration TTS Script
├── webclient/                  # Main React + TypeScript Web Application
│   ├── public/                 # Webclient Public Static Assets
│   │   ├── avatar-intro.mp4    # English Video Intro Asset
│   │   └── ksp-kannada.mp4     # Kannada Video Intro Asset
│   ├── src/
│   │   ├── assets/             # Logos, SVGs, and Static Images
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── AIAssistant/    # Floating AI Assistant Copilot
│   │   │   ├── HelpCenter/     # 24x7 Help Center Components
│   │   │   ├── IntroductionPlayer/ # Bilingual Video Player
│   │   │   ├── PlatformTour/   # 10-Scene Presentation Components
│   │   │   ├── VirtualPoliceGuide/ # Voice & Speech Avatar Guide
│   │   │   └── Sidebar.tsx     # Navigation Sidebar with Preloader
│   │   ├── context/            # Auth, Navigation, & Assistant Contexts
│   │   ├── data/               # FAQ, Articles, & Scene Datasets
│   │   ├── features/           # Feature Modules
│   │   │   ├── AIAnalysis/     # Gemini AI Dossier Analysis Engine
│   │   │   ├── AIChat/         # Conversational Database Query View
│   │   │   ├── Cases/          # Case 360 Workspace & FIR Timeline
│   │   │   ├── CommandCenter/ # 112 CAD Emergency Dispatch Grid
│   │   │   ├── Dashboard/      # Main Executive Intelligence Dashboard
│   │   │   ├── Landing/        # Public Landing View with Intro Player
│   │   │   ├── Network/        # Criminal Syndicate Graph Visualizer
│   │   │   ├── OfficerPortal/  # Officer Scorecard & Shift Logs
│   │   │   ├── People/         # Suspect Directory & Biometrics
│   │   │   ├── Predictive/     # Spatial Hotspot & Crime Forecasting
│   │   │   ├── Reports/        # Judicial Dossier PDF/Excel Exports
│   │   │   └── Settings/       # System Settings & RBAC Management
│   │   ├── hooks/              # Custom Hooks (useHelpChat, usePlatformTour, useAssistant)
│   │   ├── pages/              # Top-Level Pages (HelpCenter, AboutPlatform, CitizenPortal)
│   │   ├── App.tsx             # Root Router & Module Preloader
│   │   └── main.tsx            # React Mount Entry Point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── catalyst.json               # Zoho Catalyst Deployment Configuration
└── README.md                   # Project Documentation
```

---

## 🔒 Security & Credentials

- **Role-Based Access Control (RBAC)**: Enforces rank-based access levels (`IO`, `SHO`, `DSP`, `ADMIN`).
- **GCP Credentials Security**: All Google Cloud service account keys (`gcp-credentials.json`) are excluded via `.gitignore` to prevent credential exposure.

---

## 🤝 Support & Contact

For official technical assistance or platform inquiries:
- 📧 **Support Email**: `karnataka@ksp.gov.in`
- 📞 **Support Helpline**: `+91 80 2345 6789`
- 🛟 **24×7 Help Center**: Access the internal Support Assistant inside the application sidebar.

---

*© 2026 Karnataka State Police (KSP). All rights reserved.*
