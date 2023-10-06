import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';
import { MemberNotificationsInterface } from 'interfaces/member-notifications';
import { NewTablepatientTreatmentsInterface } from 'interfaces/new-tablepatient-treatments';
import { PatientSubstanceUseInterface } from 'interfaces/patient-substance-use';
import { PatientSymptomReportInterface } from 'interfaces/patient-symptom-report';
import { HospitalInterface } from 'interfaces/hospital';
import { UserInterface } from 'interfaces/user';
import { GeneralPractitionersInterface } from 'interfaces/general-practitioners';
import { GetQueryInterface } from 'interfaces';

export interface PatientInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  status: number;
  status_date?: any;
  status_reason?: string;
  citizen_service_number: string;
  first_name: string;
  last_name: string;
  gender: number;
  birth_date: any;
  phone_number?: string;
  email?: string;
  tour_done: boolean;
  treatment_evaluation_done: boolean;
  active_meeting?: string;
  next_hpc_meeting: number;
  next_hpc_date?: any;
  follow_up_status: number;
  assessed: boolean;
  emergency_office_hour_number?: string;
  emergency_outside_office_hour_number?: string;
  living_situation?: string;
  primary_caregiver?: string;
  informal_care?: string;
  formal_care?: string;
  hospital_id?: string;
  apn_member_id?: string;
  general_practitioner_id?: string;
  hpc_meetings?: HpcMeetingsInterface[];
  member_notifications?: MemberNotificationsInterface[];
  new_tablepatient_treatments?: NewTablepatientTreatmentsInterface[];
  patient_substance_use?: PatientSubstanceUseInterface[];
  patient_symptom_report?: PatientSymptomReportInterface[];
  hospital?: HospitalInterface;
  user?: UserInterface;
  general_practitioners?: GeneralPractitionersInterface;
  _count?: {
    hpc_meetings?: number;
    member_notifications?: number;
    new_tablepatient_treatments?: number;
    patient_substance_use?: number;
    patient_symptom_report?: number;
  };
}

export interface PatientGetQueryInterface extends GetQueryInterface {
  id?: string;
  status_reason?: string;
  citizen_service_number?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  active_meeting?: string;
  emergency_office_hour_number?: string;
  emergency_outside_office_hour_number?: string;
  living_situation?: string;
  primary_caregiver?: string;
  informal_care?: string;
  formal_care?: string;
  hospital_id?: string;
  apn_member_id?: string;
  general_practitioner_id?: string;
}
