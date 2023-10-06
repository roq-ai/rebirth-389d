import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';
import { GetQueryInterface } from 'interfaces';

export interface HpcMeetingEvaluationsInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  treatment_information: string;
  issues_since_last_review: string;
  extra_support_needed: string;
  treatment_plan_changed: boolean;
  treatment_plan_changed_how: string;
  treatment_plan_changed_other?: string;
  treatmen_plan_changed_why: string;
  how_successfull: string;
  any_further_recommandations: string;
  hpc_meeting_id?: string;

  hpc_meetings?: HpcMeetingsInterface;
  _count?: {};
}

export interface HpcMeetingEvaluationsGetQueryInterface extends GetQueryInterface {
  id?: string;
  treatment_information?: string;
  issues_since_last_review?: string;
  extra_support_needed?: string;
  treatment_plan_changed_how?: string;
  treatment_plan_changed_other?: string;
  treatmen_plan_changed_why?: string;
  how_successfull?: string;
  any_further_recommandations?: string;
  hpc_meeting_id?: string;
}
