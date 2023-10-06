import queryString from 'query-string';
import { GeneralPractitionersInterface, GeneralPractitionersGetQueryInterface } from 'interfaces/general-practitioners';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getGeneralPractitioners = async (
  query?: GeneralPractitionersGetQueryInterface,
): Promise<PaginatedInterface<GeneralPractitionersInterface>> => {
  return fetcher('/api/general-practitioners', {}, query);
};

export const createGeneralPractitioners = async (generalPractitioners: GeneralPractitionersInterface) => {
  return fetcher('/api/general-practitioners', { method: 'POST', body: JSON.stringify(generalPractitioners) });
};

export const updateGeneralPractitionersById = async (
  id: string,
  generalPractitioners: GeneralPractitionersInterface,
) => {
  return fetcher(`/api/general-practitioners/${id}`, { method: 'PUT', body: JSON.stringify(generalPractitioners) });
};

export const getGeneralPractitionersById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/general-practitioners/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteGeneralPractitionersById = async (id: string) => {
  return fetcher(`/api/general-practitioners/${id}`, { method: 'DELETE' });
};
