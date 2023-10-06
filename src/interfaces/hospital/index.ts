import { PatientInterface } from 'interfaces/patient';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface HospitalInterface {
  id?: string;
  description?: string;
  status?: number;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  address?: string;
  city?: string;
  identifier?: string;
  postal_code?: string;
  country?: string;
  language?: string;
  patient?: PatientInterface[];
  user?: UserInterface;
  _count?: {
    patient?: number;
  };
}

export interface HospitalGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
  address?: string;
  city?: string;
  identifier?: string;
  postal_code?: string;
  country?: string;
  language?: string;
}
