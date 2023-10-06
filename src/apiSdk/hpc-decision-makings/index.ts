import queryString from 'query-string';
import { HpcDecisionMakingsInterface, HpcDecisionMakingsGetQueryInterface } from 'interfaces/hpc-decision-makings';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getHpcDecisionMakings = async (
  query?: HpcDecisionMakingsGetQueryInterface,
): Promise<PaginatedInterface<HpcDecisionMakingsInterface>> => {
  return fetcher('/api/hpc-decision-makings', {}, query);
};

export const createHpcDecisionMakings = async (hpcDecisionMakings: HpcDecisionMakingsInterface) => {
  return fetcher('/api/hpc-decision-makings', { method: 'POST', body: JSON.stringify(hpcDecisionMakings) });
};

export const updateHpcDecisionMakingsById = async (id: string, hpcDecisionMakings: HpcDecisionMakingsInterface) => {
  return fetcher(`/api/hpc-decision-makings/${id}`, { method: 'PUT', body: JSON.stringify(hpcDecisionMakings) });
};

export const getHpcDecisionMakingsById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/hpc-decision-makings/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteHpcDecisionMakingsById = async (id: string) => {
  return fetcher(`/api/hpc-decision-makings/${id}`, { method: 'DELETE' });
};
