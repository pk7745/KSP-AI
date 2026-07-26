// Authoritative normalized dataset matching exact 27-table schema provided by user

export const MOCK_CRIME_MAJOR_HEADS = [
  { CrimeMajorHeadID: 101, CrimeMajorHeadName: "Property Crime", Description: "Theft, Burglary, Robbery, Dacoity" },
  { CrimeMajorHeadID: 102, CrimeMajorHeadName: "Violent Crime", Description: "Assault, Murder, Extortion" },
  { CrimeMajorHeadID: 103, CrimeMajorHeadName: "Cybercrime", Description: "Phishing, Online Fraud, IT Act Offence" },
  { CrimeMajorHeadID: 104, CrimeMajorHeadName: "Economic Offence", Description: "Forgery, Financial Fraud, Cheating" },
  { CrimeMajorHeadID: 105, CrimeMajorHeadName: "Narcotics / NDPS", Description: "Drug Trafficking, Contraband Seizure" }
];

export const MOCK_CRIME_MINOR_HEADS = [
  { CrimeMinorHeadID: 1001, CrimeMajorHeadID: 101, CrimeMinorHeadName: "Armed Robbery", Description: "Burglary of commercial establishments using force" },
  { CrimeMinorHeadID: 1002, CrimeMajorHeadID: 103, CrimeMinorHeadName: "UPI Phishing Fraud", Description: "Deceptive link sent via SMS/WhatsApp" },
  { CrimeMinorHeadID: 1003, CrimeMajorHeadID: 102, CrimeMinorHeadName: "Grievous Assault & Extortion", Description: "Group clash and money extraction" },
  { CrimeMinorHeadID: 1004, CrimeMajorHeadID: 105, CrimeMinorHeadName: "MDMA Interception", Description: "Synthetic narcotics smuggling across checkposts" },
  { CrimeMinorHeadID: 1005, CrimeMajorHeadID: 104, CrimeMinorHeadName: "Land Title Deed Forgery", Description: "Fraudulent property documents presented at bank" }
];

export const MOCK_CASE_STATUS_MASTER = [
  { CaseStatusID: 1, CaseStatusName: "Under Investigation", Description: "Active investigation led by IO" },
  { CaseStatusID: 2, CaseStatusName: "Charge Sheeted", Description: "Final report submitted to court" },
  { CaseStatusID: 3, CaseStatusName: "Closed / Undetected", Description: "Case closed post investigation" }
];

export const MOCK_DISTRICT_MASTER = [
  { DistrictID: 443, DistrictName: "Bengaluru City", StateID: 1 },
  { DistrictID: 444, DistrictName: "Mysuru City", StateID: 1 },
  { DistrictID: 445, DistrictName: "Hubballi-Dharwad", StateID: 1 },
  { DistrictID: 446, DistrictName: "Mangaluru City", StateID: 1 }
];

export const MOCK_POLICE_STATION_MASTER = [
  { PoliceStationID: 6, DistrictID: 443, StationName: "Whitefield PS", StationCode: "WFD-06", Latitude: 12.9698, Longitude: 77.7500 },
  { PoliceStationID: 7, DistrictID: 443, StationName: "Koramangala PS", StationCode: "KRM-07", Latitude: 12.9352, Longitude: 77.6245 },
  { PoliceStationID: 9, DistrictID: 444, StationName: "Devaraja PS", StationCode: "DEV-09", Latitude: 12.3051, Longitude: 76.6551 },
  { PoliceStationID: 11, DistrictID: 446, StationName: "Panambur PS", StationCode: "PNB-11", Latitude: 12.9520, Longitude: 74.8080 },
  { PoliceStationID: 10, DistrictID: 445, StationName: "Suburban PS", StationCode: "SUB-10", Latitude: 15.3647, Longitude: 75.1240 }
];

export const MOCK_OFFICER = [
  { OfficerID: 501, OfficerName: "Ins. Ramesh Kumar", BadgeNumber: "KGID-88412", MobileNumber: "9480801001", Status: "Active" },
  { OfficerID: 502, OfficerName: "Sub-Ins. Ananya Rao", BadgeNumber: "KGID-91024", MobileNumber: "9480801002", Status: "Active" },
  { OfficerID: 503, OfficerName: "Ins. Suresh Gowda", BadgeNumber: "KGID-75210", MobileNumber: "9480801003", Status: "Active" },
  { OfficerID: 504, OfficerName: "DySP Vinay Naik", BadgeNumber: "KGID-64901", MobileNumber: "9480801004", Status: "Active" }
];

export const MOCK_CASE_MASTER = [
  {
    CaseID: 10001,
    FIRNumber: "104430006202600001",
    FIRDate: "2026-07-10 14:30:00",
    ComplaintDate: "2026-07-10 02:00:00",
    CrimeMajorHeadID: 101,
    CrimeMinorHeadID: 1001,
    CaseCategoryID: 1,
    CaseStatusID: 1,
    GravityOffenceID: 1,
    DistrictID: 443,
    PoliceStationID: 6,
    InvestigationOfficerID: 501,
    CourtID: 201,
    Latitude: 12.9698,
    Longitude: 77.7500,
    IncidentAddress: "EPIP Zone Tech Warehouse, Whitefield, Bengaluru",
    IncidentDateTime: "2026-07-10 03:00:00",
    ComplaintDescription: "High-value tech warehouse burglary in Whitefield EPIP Zone. Entry via broken rear window. Server Racks and microprocessors looted valued at ₹45 Lakhs.",
    AIAnalysisStatus: "COMPLETED",
    CreatedAt: "2026-07-10 15:00:00",
    UpdatedAt: "2026-07-23 20:00:00",
    // Denormalized helper projections for fast rendering
    CrimeMajorHeadName: "Property Crime",
    CrimeMinorHeadName: "Armed Robbery",
    CaseStatusName: "Under Investigation",
    GravityOffenceName: "Heinous",
    DistrictName: "Bengaluru City",
    StationName: "Whitefield PS",
    OfficerName: "Ins. Ramesh Kumar (KGID-88412)",
    ActSections: "IPC 392, IPC 457, IPC 380"
  },
  {
    CaseID: 10002,
    FIRNumber: "104430007202600002",
    FIRDate: "2026-07-14 09:15:00",
    ComplaintDate: "2026-07-13 18:00:00",
    CrimeMajorHeadID: 103,
    CrimeMinorHeadID: 1002,
    CaseCategoryID: 1,
    CaseStatusID: 2,
    GravityOffenceID: 2,
    DistrictID: 443,
    PoliceStationID: 7,
    InvestigationOfficerID: 502,
    CourtID: 201,
    Latitude: 12.9352,
    Longitude: 77.6245,
    IncidentAddress: "8th Block Koramangala, Bengaluru",
    IncidentDateTime: "2026-07-13 18:30:00",
    ComplaintDescription: "Victim defrauded of ₹8.5 Lakhs through fake electricity bill payment link sent via WhatsApp. Fraudulent account traced to Jamtara module.",
    AIAnalysisStatus: "COMPLETED",
    CreatedAt: "2026-07-14 10:00:00",
    UpdatedAt: "2026-07-23 18:00:00",
    CrimeMajorHeadName: "Cybercrime",
    CrimeMinorHeadName: "UPI Phishing Fraud",
    CaseStatusName: "Charge Sheeted",
    GravityOffenceName: "Non-Heinous",
    DistrictName: "Bengaluru City",
    StationName: "Koramangala PS",
    OfficerName: "Sub-Ins. Ananya Rao (KGID-91024)",
    ActSections: "IT Act Sec 66D, IPC 420"
  },
  {
    CaseID: 10003,
    FIRNumber: "104440009202600003",
    FIRDate: "2026-07-18 11:00:00",
    ComplaintDate: "2026-07-17 22:30:00",
    CrimeMajorHeadID: 102,
    CrimeMinorHeadID: 1003,
    CaseCategoryID: 1,
    CaseStatusID: 1,
    GravityOffenceID: 1,
    DistrictID: 444,
    PoliceStationID: 9,
    InvestigationOfficerID: 503,
    CourtID: 202,
    Latitude: 12.3051,
    Longitude: 76.6551,
    IncidentAddress: "Sayyaji Rao Road Circle, Mysuru",
    IncidentDateTime: "2026-07-17 23:00:00",
    ComplaintDescription: "Group conflict near Sayyaji Rao Road resulting in grievous injuries. Accused extracted protection money from local vendors.",
    AIAnalysisStatus: "COMPLETED",
    CreatedAt: "2026-07-18 12:00:00",
    UpdatedAt: "2026-07-23 19:00:00",
    CrimeMajorHeadName: "Violent Crime",
    CrimeMinorHeadName: "Grievous Assault & Extortion",
    CaseStatusName: "Under Investigation",
    GravityOffenceName: "Heinous",
    DistrictName: "Mysuru City",
    StationName: "Devaraja PS",
    OfficerName: "Ins. Suresh Gowda (KGID-75210)",
    ActSections: "IPC 307, IPC 384, IPC 149"
  },
  {
    CaseID: 10004,
    FIRNumber: "104460011202600004",
    FIRDate: "2026-07-20 16:45:00",
    ComplaintDate: "2026-07-20 03:00:00",
    CrimeMajorHeadID: 105,
    CrimeMinorHeadID: 1004,
    CaseCategoryID: 1,
    CaseStatusID: 1,
    GravityOffenceID: 1,
    DistrictID: 446,
    PoliceStationID: 11,
    InvestigationOfficerID: 504,
    CourtID: 203,
    Latitude: 12.9520,
    Longitude: 74.8080,
    IncidentAddress: "Panambur Coastal Checkpost, Mangaluru",
    IncidentDateTime: "2026-07-20 04:00:00",
    ComplaintDescription: "Seizure of 450 grams synthetic MDMA valued at ₹35 Lakhs near coastal checkpost. Transported via inter-state luxury bus network.",
    AIAnalysisStatus: "COMPLETED",
    CreatedAt: "2026-07-20 17:30:00",
    UpdatedAt: "2026-07-23 21:00:00",
    CrimeMajorHeadName: "Narcotics / NDPS",
    CrimeMinorHeadName: "MDMA Interception",
    CaseStatusName: "Under Investigation",
    GravityOffenceName: "Heinous",
    DistrictName: "Mangaluru City",
    StationName: "Panambur PS",
    OfficerName: "DySP Vinay Naik (KGID-64901)",
    ActSections: "NDPS Act Sec 22(c), Sec 29"
  }
];

export const MOCK_ACCUSED = [
  { AccusedID: 801, CaseID: 10001, AccusedName: "Vikram @ Vicky", AliasName: "Vicky Burglary Gang", GenderID: 1, Age: 32, ArrestStatus: "Arrested", PreviousCrimeCount: 4, WantedStatus: "In Custody" },
  { AccusedID: 802, CaseID: 10001, AccusedName: "Sunil S.", AliasName: "Sunil Tech", GenderID: 1, Age: 28, ArrestStatus: "Absconding", PreviousCrimeCount: 1, WantedStatus: "Wanted" },
  { AccusedID: 803, CaseID: 10002, AccusedName: "Rohit Kumar", AliasName: "Jamtara Module Head", GenderID: 1, Age: 25, ArrestStatus: "Arrested", PreviousCrimeCount: 3, WantedStatus: "Remand" },
  { AccusedID: 804, CaseID: 10003, AccusedName: "Vikram @ Vicky", AliasName: "Vicky Burglary Gang", GenderID: 1, Age: 32, ArrestStatus: "Arrested", PreviousCrimeCount: 4, WantedStatus: "In Custody" },
  { AccusedID: 805, CaseID: 10004, AccusedName: "Mohammed Ziyad", AliasName: "Ziyad Coastal Nexus", GenderID: 1, Age: 29, ArrestStatus: "Arrested", PreviousCrimeCount: 2, WantedStatus: "Remand" }
];

export const MOCK_VICTIM = [
  { VictimID: 901, CaseID: 10001, VictimName: "Apex Tech Logistics", GenderID: 3, Age: 0, PhoneNumber: "080-28410000", InjuryDetails: "None (Property Loss)", Statement: "Warehouse entry door locks breached" },
  { VictimID: 902, CaseID: 10002, VictimName: "Narayanan Swamy", GenderID: 1, Age: 61, PhoneNumber: "9845012345", InjuryDetails: "Financial Defraudment", Statement: "Clicked SMS link thinking it was electricity notice" }
];

export const MOCK_WITNESS = [
  { WitnessID: 301, CaseID: 10001, WitnessName: "Rajesh Guard", GenderID: 1, Age: 42, PhoneNumber: "9900112233", Statement: "Saw black pickup truck leaving warehouse at 03:15 AM" }
];

export const MOCK_EVIDENCE = [
  { EvidenceID: 401, CaseID: 10001, EvidenceTypeID: 1, EvidenceTitle: "CCTV Footages", FileName: "cam_epip_03am.mp4", Description: "Clear footage showing 2 suspects loading server racks", ConfidenceScore: 0.96 }
];

export const MOCK_ACTIVITY_LOG = [
  { ActivityID: "LOG-101", UserID: "SHO-88412", UserName: "Ins. Ramesh Kumar", Action: "Query CaseMaster", Module: "AI Chat", Timestamp: "2026-07-23 21:10:15" },
  { ActivityID: "LOG-102", UserID: "ANALYST-01", UserName: "SCRB Analyst", Action: "Inspect Network Graph", Module: "Criminal Network", Timestamp: "2026-07-23 22:04:30" }
];
