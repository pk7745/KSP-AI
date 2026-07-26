# 🚨 KSP AI Crime Intelligence Platform

> **Karnataka State Police — Statewide Crime Intelligence, AI Case Analysis & Dossier Repository**

![KSP AI Banner](webclient/src/assets/ksp-logo.svg)

---

## 🌐 Live Cloud Deployment Links

- **Main Application Entry**: [https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html](https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html)
- **24×7 Help Center**: [https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/help-center](https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/help-center)
- **Interactive Platform Tour**: [https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/about-platform](https://ksp-crime-intelligence-929238497.development.catalystserverless.com/app/index.html#/about-platform)
- **Backend AppSail Function**: [https://ksp-crime-intelligence-function-10128235536.development.catalystappsail.com](https://ksp-crime-intelligence-function-10128235536.development.catalystappsail.com)

---

## 📋 Overview

The **KSP AI Crime Intelligence Platform** is an enterprise-grade, AI-powered investigation system engineered for the **Karnataka State Police (KSP)**. It unifies CCTNS FIR ledgers across 31 Karnataka district jurisdictions, provides real-time 112 emergency CAD dispatch synchronization, extracts forensic evidence entities via Google Gemini AI OCR, projects spatial crime heatmaps, and constructs multi-district criminal syndicate nexus graphs.

---

## ✨ Key Features

### 🛟 1. 24×7 Officer Help Center
- **Internal Support Assistant**: Government-themed virtual support assistant answering platform queries 24/7.
- **Support Contacts**: Direct email (`karnataka@ksp.gov.in`) and phone (`+91 80 2345 6789`) channels.
- **Searchable Knowledge Base**: 12 comprehensive step-by-step help articles and 13 interactive FAQ accordions.
- **Future-Ready AI Architecture**: Decoupled hook system (`useHelpChat.ts`) ready for Google Gemini / Vertex AI backend endpoints.

### 🌐 2. Zero-Refresh Bilingual Support (English & Kannada)
- Instant 0ms language toggle between **English** and **Kannada** across all UI components, case summaries, search bars, and voice narration streams.
- Professional **Male Kannada Voice** (`kn-IN-Standard-B`) and **Male Indian English Voice** (`en-IN-Neural2-B`).

### 🎬 3. 10-Scene Interactive Platform Tour
- Guided visual presentation demonstrating core platform capabilities (Dashboard, CCTNS Cases, AI OCR Evidence, Gemini Legal Assistant, GIS Hotspots, Criminal Nexus, Reports, and Officer Portal).
- Pre-warmed visual scene previews running at 60 FPS.

### 🔬 4. AI Forensic Evidence OCR Analysis
- Automatic entity extraction (suspect names, bank account numbers, Aadhaar IDs, vehicle registrations, IP addresses) from scanned physical evidence documents using Google Gemini AI.

### 🗺️ 5. GIS Spatial Hotspot & Hoysala Patrol Route Dispatch
- Interactive Leaflet heatmaps mapping crime density across Bengaluru, Mysuru, Mangaluru, Belagavi, and Hubballi-Dharwad.
- Automated patrol route recommendations for Hoysala mobile units during peak risk hours.

### 🕸️ 6. Criminal Syndicate Nexus Graph
- Force-directed network graphs visualizing co-accused linkages, shared getaway vehicles, address overlaps, and repeat offender syndicate hubs.

### 📑 7. Automated Reports & Judicial Dossier Export
- One-click export for court-ready PDF briefs and master Excel datasets with embedded digital badge security watermarks.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, Lucide Icons, Glassmorphism CSS |
| **Animations** | Framer Motion (GPU Hardware Accelerated) |
| **Mapping & GIS** | Leaflet, React-Leaflet, CartoDB Light basemaps |
| **Internationalization** | i18next, react-i18next (English & Kannada) |
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
│   │   │   ├── HelpCenter/     # 24x7 Help Center Components
│   │   │   ├── IntroductionPlayer/ # Bilingual Video Player
│   │   │   ├── PlatformTour/   # 10-Scene Presentation Components
│   │   │   └── Sidebar.tsx     # Navigation Sidebar with Preloader
│   │   ├── context/            # Auth, Navigation, & Assistant Contexts
│   │   ├── data/               # FAQ, Articles, & Scene Datasets
│   │   ├── features/           # Feature Modules (Dashboard, Cases, AI Analysis)
│   │   ├── hooks/              # Custom Hooks (useHelpChat, usePlatformTour)
│   │   ├── pages/              # Top-Level Pages (HelpCenter, AboutPlatform)
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
