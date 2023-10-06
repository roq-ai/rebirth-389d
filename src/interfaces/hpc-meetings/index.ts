import { HpcDecisionMakingsInterface } from 'interfaces/hpc-decision-makings';
import { HpcMeetingEvaluationsInterface } from 'interfaces/hpc-meeting-evaluations';
import { HpcMeetingMembersInterface } from 'interfaces/hpc-meeting-members';
import { PatientInterface } from 'interfaces/patient';
import { GetQueryInterface } from 'interfaces';

export interface HpcMeetingsInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  status: number;
  meeting_type: number;
  date: any;
  current_step?: number;
  number?: number;
  snapshot_id?: string;
  patient_id?: string;
  hpc_decision_makings?: HpcDecisionMakingsInterface[];
  hpc_meeting_evaluations?: HpcMeetingEvaluationsInterface[];
  hpc_meeting_members?: HpcMeetingMembersInterface[];
  patient?: PatientInterface;
  _count?: {
    hpc_decision_makings?: number;
    hpc_meeting_evaluations?: number;
    hpc_meeting_members?: number;
  };
}

export interface HpcMeetingsGetQueryInterface extends GetQueryInterface {
  id?: string;
  snapshot_id?: string;
  patient_id?: string;
}
