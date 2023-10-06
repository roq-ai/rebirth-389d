import queryString from 'query-string';
import { HpcMeetingMembersInterface, HpcMeetingMembersGetQueryInterface } from 'interfaces/hpc-meeting-members';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getHpcMeetingMembers = async (
  query?: HpcMeetingMembersGetQueryInterface,
): Promise<PaginatedInterface<HpcMeetingMembersInterface>> => {
  return fetcher('/api/hpc-meeting-members', {}, query);
};

export const createHpcMeetingMembers = async (hpcMeetingMembers: HpcMeetingMembersInterface) => {
  return fetcher('/api/hpc-meeting-members', { method: 'POST', body: JSON.stringify(hpcMeetingMembers) });
};

export const updateHpcMeetingMembersById = async (id: string, hpcMeetingMembers: HpcMeetingMembersInterface) => {
  return fetcher(`/api/hpc-meeting-members/${id}`, { method: 'PUT', body: JSON.stringify(hpcMeetingMembers) });
};

export const getHpcMeetingMembersById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/hpc-meeting-members/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteHpcMeetingMembersById = async (id: string) => {
  return fetcher(`/api/hpc-meeting-members/${id}`, { method: 'DELETE' });
};
