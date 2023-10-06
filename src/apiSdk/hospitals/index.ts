import queryString from 'query-string';
import { HospitalInterface, HospitalGetQueryInterface } from 'interfaces/hospital';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getHospitals = async (
  query?: HospitalGetQueryInterface,
): Promise<PaginatedInterface<HospitalInterface>> => {
  return fetcher('/api/hospitals', {}, query);
};

export const createHospital = async (hospital: HospitalInterface) => {
  return fetcher('/api/hospitals', { method: 'POST', body: JSON.stringify(hospital) });
};

export const updateHospitalById = async (id: string, hospital: HospitalInterface) => {
  return fetcher(`/api/hospitals/${id}`, { method: 'PUT', body: JSON.stringify(hospital) });
};

export const getHospitalById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/hospitals/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteHospitalById = async (id: string) => {
  return fetcher(`/api/hospitals/${id}`, { method: 'DELETE' });
};
