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

## 🚀 3-Minute Quickstart (Run Locally)

Copy and paste these commands into your terminal to get up and running immediately:

```bash
# 1. Clone the repository
git clone https://github.com/pk7745/KSP-AI.git
cd KSP-AI

# 2. Install frontend dependencies
cd webclient
npm install

# 3. Start local development server
npm run dev
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
