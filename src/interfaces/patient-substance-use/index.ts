import { PatientInterface } from 'interfaces/patient';
import { GetQueryInterface } from 'interfaces';

export interface PatientSubstanceUseInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  substance_use: string;
  patient_id?: string;

  patient?: PatientInterface;
  _count?: {};
}

export interface PatientSubstanceUseGetQueryInterface extends GetQueryInterface {
  id?: string;
  substance_use?: string;
  patient_id?: string;
}
