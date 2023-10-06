import queryString from 'query-string';
import { HpcMeetingsInterface, HpcMeetingsGetQueryInterface } from 'interfaces/hpc-meetings';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getHpcMeetings = async (
  query?: HpcMeetingsGetQueryInterface,
): Promise<PaginatedInterface<HpcMeetingsInterface>> => {
  return fetcher('/api/hpc-meetings', {}, query);
};

export const createHpcMeetings = async (hpcMeetings: HpcMeetingsInterface) => {
  return fetcher('/api/hpc-meetings', { method: 'POST', body: JSON.stringify(hpcMeetings) });
};

export const updateHpcMeetingsById = async (id: string, hpcMeetings: HpcMeetingsInterface) => {
  return fetcher(`/api/hpc-meetings/${id}`, { method: 'PUT', body: JSON.stringify(hpcMeetings) });
};

export const getHpcMeetingsById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/hpc-meetings/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteHpcMeetingsById = async (id: string) => {
  return fetcher(`/api/hpc-meetings/${id}`, { method: 'DELETE' });
};
