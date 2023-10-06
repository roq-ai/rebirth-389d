import { PatientInterface } from 'interfaces/patient';
import { GetQueryInterface } from 'interfaces';

export interface GeneralPractitionersInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  last_name: string;
  email: string;
  personal_phone: string;
  office_phone: string;
  patient?: PatientInterface[];

  _count?: {
    patient?: number;
  };
}

export interface GeneralPractitionersGetQueryInterface extends GetQueryInterface {
  id?: string;
  last_name?: string;
  email?: string;
  personal_phone?: string;
  office_phone?: string;
}
