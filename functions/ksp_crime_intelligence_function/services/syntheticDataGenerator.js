/**
 * Enterprise Synthetic Investigation Dataset Generator & Case360 Ecosystem Provider
 * Generates realistic synthetic portraits, mugshots, CCTV video clips, emergency audio logs,
 * forensic FSL reports, DNA profiles, and fingerprint sheets for 5,500+ investigations.
 */

// Synthetic Avatar URIs for fast zero-latency demonstration portraits
export function getSyntheticPortrait(type, idSeed = '1') {
  const seedNum = (parseInt(String(idSeed).replace(/\D/g, ''), 10) || 1) % 70;
  const gender = seedNum % 2 === 0 ? 'men' : 'women';

  // High quality fictional portrait photos
  return `https://randomuser.me/api/portraits/${gender}/${seedNum}.jpg`;
}

export function enrichCaseEcosystem(caseRecord, victims = [], accused = [], witnesses = [], evidence = []) {
  const cNo = caseRecord.CrimeNumber || caseRecord.CrimeNo || 'KSP/DIS001/2026/00001';
  const crimeHead = caseRecord.CrimeMajorHead || 'Homicide / Offense';
  const district = caseRecord.District || 'Bengaluru Urban';
  const station = caseRecord.PoliceStation || 'Cubbon Park PS';

  // 1. Enrich Accused with Synthetic Mugshots & DNA/Fingerprint IDs
  const enrichedAccused = accused.map((a, idx) => ({
    ...a,
    PhotoUrl: getSyntheticPortrait('accused', a.AccusedID || idx + 10),
    FingerprintID: `FP-2026-${String(idx + 101).padStart(4, '0')}`,
    DNACode: `DNA-KSP-${String(idx + 501).padStart(4, '0')}`,
    GangDetails: a.GangDetails || 'Local Criminal Syndicate',
    CriminalHistory: a.CriminalHistory || 'Prior FIR 2024/089 registered under Sec 379 IPC',
    Mobile: a.Mobile || `+91 98765 ${10000 + idx}`
  }));

  if (enrichedAccused.length === 0) {
    enrichedAccused.push({
      AccusedID: 'ACC-101',
      CaseID: cNo,
      AccusedName: 'Ramesh @ Manya',
      Age: 29,
      Gender: 'Male',
      ArrestStatus: 'Under Investigation',
      PhotoUrl: getSyntheticPortrait('accused', '101'),
      FingerprintID: 'FP-2026-0101',
      DNACode: 'DNA-KSP-0501',
      GangDetails: 'Bangalore East Syndicate',
      CriminalHistory: 'Prior arrest in 2024 (Sec 380 IPC Theft)',
      Mobile: '+91 98765 10101'
    });
  }

  // 2. Enrich Victims with Synthetic Portraits & Medical Notes
  const enrichedVictims = victims.map((v, idx) => ({
    ...v,
    PhotoUrl: getSyntheticPortrait('victim', v.VictimID || idx + 30),
    MedicalSummary: v.MedicalSummary || 'Admitted to Victoria Hospital. Condition Stable.',
    InjuryType: v.InjuryType || 'Blunt force trauma / Mild laceration'
  }));

  if (enrichedVictims.length === 0) {
    enrichedVictims.push({
      VictimID: 'VIC-201',
      CaseID: cNo,
      VictimName: 'Suresh Kumar',
      Age: 35,
      Gender: 'Male',
      VictimStatus: 'Safe & Recovered',
      PhotoUrl: getSyntheticPortrait('victim', '201'),
      MedicalSummary: 'Treated at Bowring Hospital. Outpatient care.',
      InjuryType: 'Mild Laceration',
      Address: `${station}, ${district}`
    });
  }

  // 3. Enrich Witnesses with Statements & Photos
  const enrichedWitnesses = witnesses.map((w, idx) => ({
    ...w,
    PhotoUrl: getSyntheticPortrait('witness', w.WitnessID || idx + 50),
    Statement: w.Statement || `Observed suspicious activity near ${station} around 22:30 IST. Statement recorded under Sec 161 CrPC.`,
    ReliabilityScore: 'HIGH (92%)'
  }));

  if (enrichedWitnesses.length === 0) {
    enrichedWitnesses.push({
      WitnessID: 'WIT-301',
      CaseID: cNo,
      WitnessName: 'Anand Murthy',
      Age: 42,
      PhotoUrl: getSyntheticPortrait('witness', '301'),
      Statement: `Confirmed seeing suspect vehicle near crime scene around 22:45 IST. Statement verified under Sec 161 CrPC.`,
      ReliabilityScore: 'HIGH (95%)'
    });
  }

  // 4. Enrich Evidence Vault with Photos, CCTV Video Clips, Emergency Audio & Forensic Reports
  const enrichedEvidence = [...evidence];

  // Add CCTV Video Clip item
  enrichedEvidence.push({
    EvidenceID: `EV-VID-${cNo.replace(/\//g, '-')}`,
    CaseID: cNo,
    EvidenceType: 'Video',
    EvidenceNumber: 'CCTV-CLIP-01',
    Description: 'ATM & Street CCTV Video Dump (1080p, 15 FPS)',
    StoragePath: `ksp-data/${cNo}/videos/cctv_dump_01.mp4`,
    ThumbnailUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80',
    MediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    UploadDate: '2026-02-15 11:30:00',
    CollectedBy: 'Sub Inspector Priya Sharma',
    VerificationStatus: 'VERIFIED',
    CourtAdmissibility: 'Admissible under Sec 65B Evidence Act'
  });

  // Add Emergency Audio Call Log item
  enrichedEvidence.push({
    EvidenceID: `EV-AUD-${cNo.replace(/\//g, '-')}`,
    CaseID: cNo,
    EvidenceType: 'Audio',
    EvidenceNumber: '112-SOS-CALL',
    Description: 'Control Room 112 Emergency SOS Call Log (02:45 mins)',
    StoragePath: `ksp-data/${cNo}/audio/112_sos_recording.mp3`,
    MediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    Transcript: `[Caller]: Emergency! Burglary in progress near commercial complex! [Control Room]: Station vehicle PCR-12 dispatched immediately to spot.`,
    UploadDate: '2026-02-15 10:35:00',
    CollectedBy: 'Control Room Duty Officer',
    VerificationStatus: 'VERIFIED',
    CourtAdmissibility: 'Admissible'
  });

  // Add FSL Forensic Report PDF item
  enrichedEvidence.push({
    EvidenceID: `EV-FSL-${cNo.replace(/\//g, '-')}`,
    CaseID: cNo,
    EvidenceType: 'Document',
    EvidenceNumber: 'SFSL-REPORT-2026',
    Description: 'State Forensic Science Laboratory (SFSL) Ballistics & AFIS Fingerprint Match Report',
    StoragePath: `ksp-data/${cNo}/documents/sfsl_forensic_report.pdf`,
    ThumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    UploadDate: '2026-02-16 15:20:00',
    CollectedBy: 'FSL Senior Expert Dr. K. Rao',
    VerificationStatus: 'VERIFIED',
    CourtAdmissibility: 'Admissible Expert Opinion (Sec 45 Evidence Act)'
  });

  // Add Crime Scene Photo item
  enrichedEvidence.push({
    EvidenceID: `EV-IMG-${cNo.replace(/\//g, '-')}`,
    CaseID: cNo,
    EvidenceType: 'Image',
    EvidenceNumber: 'SCENE-PHOTO-01',
    Description: 'High-Resolution Spot Inspection & Physical Property Recovery Photo',
    StoragePath: `ksp-data/${cNo}/images/scene_spot_01.jpg`,
    ThumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    MediaUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    UploadDate: '2026-02-15 12:00:00',
    CollectedBy: 'IO Inspector Rajesh',
    VerificationStatus: 'VERIFIED',
    CourtAdmissibility: 'Admissible'
  });

  return {
    caseDetails: caseRecord,
    victims: enrichedVictims,
    accused: enrichedAccused,
    witnesses: enrichedWitnesses,
    evidence: enrichedEvidence
  };
}
