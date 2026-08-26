# KSP AI Crime Intelligence Platform — Handover Extracted Features Blueprint

> **Master Architecture & Extracted Feature Summary**  
> This document details all extracted code modules, architecture specifications, PDF generation logic, bilingual speech services, legal glossaries, citizen portal workflows, and Sprint 1 baseline engine capabilities for the **Karnataka State Police (KSP) AI Crime Intelligence Platform**.

---

## 1. OFFICIAL COURT-ADMISSIBLE DOSSIER PDF GENERATOR (`dossierPdfGenerator.ts`)
- **Library**: `jspdf` with client-side canvas rendering and custom font embedding.
- **Key Capabilities**:
  - 13 Official Sections: Title Cover, Executive Briefing, FIR Brief Facts, Applicable IPC/BNS Acts, Accused Profiles, Victim Statements, Witness Manifest, Evidence Locker, Criminal Nexus Overlap, AI Analysis, IO Recommendations, QR Code Verification, and Cryptographic SHA256 Hash (`SHA256:EC916A20E833...`).
  - Native Unicode Kannada Font support (`kn-IN`) preventing tofu character corruption.
  - One-click trigger from `Case360Workspace.tsx`.

---

## 2. INTERACTIVE CASE 360 FULL INVESTIGATION WORKSPACE (`Case360Workspace.tsx`)
- **Key Capabilities**:
  - High-density 3-column grid displaying full FIR metadata, station jurisdiction, crime major head, gravity badge, and case status badge.
  - Interactive Accused Cards with mugshots, arrest status, Fingerprint ID (`FP-2026-0101`), and DNA Code (`DNA-KSP-0501`).
  - Evidence Locker supporting 1080p HTML5 CCTV video player (with `playsInline`), 112 emergency SOS call audio player with transcripts, and SFSL forensic document previews.
  - Integrated 7-step Case Resolution & Reopening Wizard modal with server-side optimistic locking (`version`).

---

## 3. KSP POLICE & LEGAL TERMINOLOGY GLOSSARY (`kspPoliceGlossary.ts`)
- **Key Capabilities**:
  - Human-curated legal and police rank glossary providing 100% bilingual translation parity between English and Kannada.
  - Mappings for Police Ranks: `DGP` (ಮಹಾನಿರ್ದೇಶಕರು), `IGP` (ಮಹಾನಿರೀಕ್ಷಕರು), `SP` (ಪೊಲೀಸ್ ಸೂಪರಿಂಟೆಂಡೆಂಟ್), `DSP` (ಉಪ ಪೊಲೀಸ್ ಸೂಪರಿಂಟೆಂಡೆಂಟ್), `SHO` (ಠಾಣಾಧಿಕಾರಿ), `IO` (ತನಿಖಾಧಿಕಾರಿ), `Constable` (ಕಾನ್‌ಸ್ಟೇಬಲ್).
  - Statutory Mappings: Sec 302 IPC / 103 BNS (Murder), Sec 379 IPC / 303 BNS (Theft), Sec 65B Evidence Act (Digital Hash Verification), Sec 161 CrPC (Witness Statement).

---

## 4. DUAL-LAYER SPEECH SERVICE (`speechService.ts`)
- **Key Capabilities**:
  - Primary streaming engine using Google Cloud Text-to-Speech (`POST /speech`) returning high-fidelity binary MP3 streams (`kn-IN` & `en-IN`).
  - Offline fallback engine utilizing Web Speech API (`window.speechSynthesis`) if network connection drops.
  - Floating `VirtualPoliceGuide.tsx` avatar controller with play, pause, replay, and mute controls.

---

## 5. CITIZEN PORTAL & EMERGENCY SERVICES (`PublicLandingView.tsx`)
- **Key Capabilities**:
  - Public portal interface for Karnataka citizens to file anonymous grievances or official complaints.
  - Emergency hotline integration: `112` Emergency SOS, `1090` Senior Citizen Helpline, `1930` Cyber Crime Helpline.
  - Real-time FIR status lookup by Phone Number or Complaint Reference ID.

---

## 6. SPRINT 1 ENGINE BASELINE & DATASTORE CAPABILITIES
- **Data Scale**: 28 Stratus CCTNS CSV datasets comprising 5,500 FIR cases and 43,444 records.
- **RAG Query Planner**: Sub-10ms p95 query latency delivering the **5-Part Structured Answer Contract**:
  1. *Retrieved Information* (with CCTNS record IDs)
  2. *AI Analysis & Cross-Record Derivation*
  3. *Grounded IO Recommendations*
  4. *Evidence-Backed Confidence* (corroboration proof)
  5. *Supporting Records* (clickable provenance)
- **Security & RBAC**: Server-side jurisdiction scoping enforcing district boundaries with fail-closed 403 authorization checks.
