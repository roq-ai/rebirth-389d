const mapping: Record<string, string> = {
  'general-practitioners': 'general_practitioners',
  hospitals: 'hospital',
  'hpc-decision-makings': 'hpc_decision_makings',
  'hpc-meeting-evaluations': 'hpc_meeting_evaluations',
  'hpc-meeting-members': 'hpc_meeting_members',
  'hpc-meetings': 'hpc_meetings',
  'member-notifications': 'member_notifications',
  'new-tablepatient-treatments': 'new_tablepatient_treatments',
  patients: 'patient',
  'patient-substance-uses': 'patient_substance_use',
  'patient-symptom-reports': 'patient_symptom_report',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
