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
- **Case Detail Modal**: In-depth view for updating investigation notes, adding co-accused entities, and attaching forensic lab reports.

### 🚨 6. Emergency Command Center & 112 CAD Dispatch Grid
- **Real-Time Incident Grid (`CommandCenterView.tsx`)**: Monitor incoming 112 emergency CAD calls, prioritize high-severity dispatch events, and track Hoysala patrol unit response times.
- **Patrol Alert Broadcasting**: Direct push alerts to division patrol units based on real-time spatial trigger zones.

### 📊 7. Executive Statewide Crime Dashboard
- **Real-Time Crime Analytics (`DashboardView.css` & `DashboardView.tsx`)**: High-level metrics tracking total registered FIRs, pending charge-sheets, conviction rates, and active hotspot warnings across Karnataka jurisdictions.

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
- **Predictive Analytics Engine**: Machine learning spatial-temporal models forecasting incident probability by hour, division, and environmental risk factors.

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

## 🚀 Setup & Execution Instructions

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**
- **Zoho Catalyst CLI** *(for deployment)*: `npm install -g zcatalyst-cli`

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/pk7745/KSP-AI.git
cd KSP-AI
```

---

### Step 2: Install Dependencies

#### 1. Install Webclient Dependencies:
```bash
cd webclient
npm install
```

#### 2. Install Backend Function Dependencies:
```bash
cd ../functions/ksp_crime_intelligence_function
npm install
cd ../..
```

---

### Step 3: Local Development Execution

To start the Vite development server locally:

```bash
cd webclient
npm run dev
```

Open your browser and navigate to:  
👉 `http://localhost:5173/`

---

### Step 4: Build for Production

To perform TypeScript type-checking and compile the production bundle:

```bash
cd webclient
npm run build
```

The compiled static files will be placed inside `webclient/dist`.

---

### Step 5: Zoho Catalyst Cloud Deployment

To deploy the platform directly to **Zoho Catalyst Cloud Hosting**:

#### 1. Login to Catalyst CLI:
```bash
catalyst login
```

#### 2. Deploy Webclient Static Hosting:
```bash
catalyst deploy --only client
```

#### 3. Deploy Backend Functions (AppSail):
```bash
catalyst deploy --only functions
```

#### 4. Deploy Full Application Stack:
```bash
catalyst deploy
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
