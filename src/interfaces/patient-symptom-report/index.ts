import { PatientInterface } from 'interfaces/patient';
import { GetQueryInterface } from 'interfaces';

export interface PatientSymptomReportInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  patient_id: string;
  mood: number;
  streak: number;
  any_severe: boolean;
  any_other_symptoms: boolean;

  patient?: PatientInterface;
  _count?: {};
}

export interface PatientSymptomReportGetQueryInterface extends GetQueryInterface {
  id?: string;
  patient_id?: string;
}
