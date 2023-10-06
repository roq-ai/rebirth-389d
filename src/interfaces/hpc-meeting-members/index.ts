import { UserInterface } from 'interfaces/user';
import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';
import { GetQueryInterface } from 'interfaces';

export interface HpcMeetingMembersInterface {
  id?: string;
  created_at?: any;
  updated_at?: any;
  user_id?: string;
  hpc_meetings_id?: string;

  user?: UserInterface;
  hpc_meetings?: HpcMeetingsInterface;
  _count?: {};
}

export interface HpcMeetingMembersGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  hpc_meetings_id?: string;
}
