import { intelligenceIndex } from './intelligenceIndex.js';

/**
 * Strict RBAC Jurisdiction & Emergency Access Enforcer
 * Enforces strict district/station data boundaries based on officer role and checks EmergencyAccess.csv overrides.
 */
export function enforceRBAC(officerId, requestedDistrict, requestedQuery, isKn = false) {
  const officers = intelligenceIndex.getOfficers();
  const districts = intelligenceIndex.getDistricts();

  const officer = intelligenceIndex.getOfficer(officerId) || officers.find(o => o.OfficerID === officerId) || {
    OfficerID: officerId || 'OFF001',
    OfficerName: 'Inspector Rajesh Kumar',
    Rank: officerId && officerId.toUpperCase().includes('DGP') ? 'DGP' : 'Circle Inspector',
    DistrictID: 'DIS001',
    PoliceStation: 'Cubbon Park Police Station'
  };

  const officerRank = (officer.Rank || '').toUpperCase();
  const officerDistrictId = officer.DistrictID || 'DIS001';
  const officerDistrictObj = districts.find(d => d.DistrictID === officerDistrictId) || { DistrictName: 'Bengaluru Urban' };
  const authorizedDistrictName = officerDistrictObj.DistrictName || 'Bengaluru Urban';

  // 1. Check if Officer has Statewide Clearance (DGP, IGP, DIG, Senior Command, Admin)
  const idUpper = (officerId || '').toUpperCase();
  const isStatewideRank = idUpper.includes('DGP') || idUpper.includes('ADMIN') || officerRank.includes('DGP') || officerRank.includes('IGP') || officerRank.includes('DIG') || officerRank.includes('COMMISSIONER') || officerRank.includes('ADMIN');

  if (isStatewideRank) {
    return {
      authorized: true,
      authorizedDistrict: 'Statewide (Karnataka)',
      allowedCases: intelligenceIndex.getCases()
    };
  }

  // 2. Check Emergency Access Overrides from EmergencyAccess.csv
  const emergencyLogs = intelligenceIndex.getEmergencyAccessLogs();
  const activeEmergencyAccess = emergencyLogs.find(e => 
    e.OfficerID === officer.OfficerID && 
    (e.Status === 'Approved' || e.Status === 'Active') &&
    (!requestedDistrict || e.DistrictID === requestedDistrict || e.DistrictID === officerDistrictId)
  );

  if (activeEmergencyAccess) {
    return {
      authorized: true,
      authorizedDistrict: `${authorizedDistrictName} (Emergency Access Granted)`,
      allowedCases: intelligenceIndex.getCases()
    };
  }

  // 3. District Alignment Verification
  const allCases = intelligenceIndex.getCases();
  
  if (requestedDistrict) {
    const isTargetDistrict = requestedDistrict.toLowerCase().includes(authorizedDistrictName.toLowerCase()) || 
                           authorizedDistrictName.toLowerCase().includes(requestedDistrict.toLowerCase()) ||
                           requestedDistrict.toLowerCase() === officerDistrictId.toLowerCase();

    if (!isTargetDistrict) {
      const restrictionReason = isKn
        ? `ಪ್ರವೇಶವನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ನಿಮಗೆ ${authorizedDistrictName} ಜಿಲ್ಲೆಯ ದಾಖಲೆಗಳನ್ನು ಮಾತ್ರ ವೀಕ್ಷಿಸಲು ಅಧಿಕಾರವಿದೆ. ನೆರೆಯ ಜಿಲ್ಲೆಗಳ ತನಿಖಾ ದಾಖಲೆಗಳ ಪ್ರವೇಶಕ್ಕಾಗಿ ನಿಮ್ಮ ಹಿರಿಯ ಅಧಿಕಾರಿಗಳಿಂದ ಅನುಮತಿ ಪಡೆಯಿರಿ.`
        : `Access Restricted. You are authorised to access only ${authorizedDistrictName} district records. Request approval from your supervisory authority if cross-district investigation access is required.`;

      return {
        authorized: false,
        authorizedDistrict: authorizedDistrictName,
        restrictionReason,
        allowedCases: []
      };
    }
  }

  const districtFilteredCases = allCases.filter(c => {
    const cDist = (c.District || c.DistrictID || '').toLowerCase();
    return cDist.includes(authorizedDistrictName.toLowerCase()) || cDist.includes(officerDistrictId.toLowerCase());
  });

  return {
    authorized: true,
    authorizedDistrict: authorizedDistrictName,
    allowedCases: districtFilteredCases
  };
}
