import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';
import { GetQueryInterface } from 'interfaces';

export interface HpcDecisionMakingsInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  hpc_meeting_id?: string;
  life_expectancy_without_cancer: string;
  life_expectancy_untreated: string;
  burden_cancer_untreated: string;
  add_life_expectancy: string;

  hpc_meetings?: HpcMeetingsInterface;
  _count?: {};
}

export interface HpcDecisionMakingsGetQueryInterface extends GetQueryInterface {
  id?: string;
  hpc_meeting_id?: string;
  life_expectancy_without_cancer?: string;
  life_expectancy_untreated?: string;
  burden_cancer_untreated?: string;
  add_life_expectancy?: string;
}
