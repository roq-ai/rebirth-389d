import { PatientInterface } from 'interfaces/patient';
import { GetQueryInterface } from 'interfaces';

export interface NewTablepatientTreatmentsInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  patient_id?: string;

  patient?: PatientInterface;
  _count?: {};
}

export interface NewTablepatientTreatmentsGetQueryInterface extends GetQueryInterface {
  id?: string;
  patient_id?: string;
}
