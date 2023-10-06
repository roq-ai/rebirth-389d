import queryString from 'query-string';
import {
  HpcMeetingEvaluationsInterface,
  HpcMeetingEvaluationsGetQueryInterface,
} from 'interfaces/hpc-meeting-evaluations';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getHpcMeetingEvaluations = async (
  query?: HpcMeetingEvaluationsGetQueryInterface,
): Promise<PaginatedInterface<HpcMeetingEvaluationsInterface>> => {
  return fetcher('/api/hpc-meeting-evaluations', {}, query);
};

export const createHpcMeetingEvaluations = async (hpcMeetingEvaluations: HpcMeetingEvaluationsInterface) => {
  return fetcher('/api/hpc-meeting-evaluations', { method: 'POST', body: JSON.stringify(hpcMeetingEvaluations) });
};

export const updateHpcMeetingEvaluationsById = async (
  id: string,
  hpcMeetingEvaluations: HpcMeetingEvaluationsInterface,
) => {
  return fetcher(`/api/hpc-meeting-evaluations/${id}`, { method: 'PUT', body: JSON.stringify(hpcMeetingEvaluations) });
};

export const getHpcMeetingEvaluationsById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/hpc-meeting-evaluations/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteHpcMeetingEvaluationsById = async (id: string) => {
  return fetcher(`/api/hpc-meeting-evaluations/${id}`, { method: 'DELETE' });
};
