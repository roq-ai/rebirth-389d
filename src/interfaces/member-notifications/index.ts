import { PatientInterface } from 'interfaces/patient';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MemberNotificationsInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  notification_type: number;
  read: boolean;
  next_hpc_meeting_date?: any;
  archived?: boolean;
  patient_id?: string;
  member_id?: string;

  patient?: PatientInterface;
  user?: UserInterface;
  _count?: {};
}

export interface MemberNotificationsGetQueryInterface extends GetQueryInterface {
  id?: string;
  patient_id?: string;
  member_id?: string;
}
