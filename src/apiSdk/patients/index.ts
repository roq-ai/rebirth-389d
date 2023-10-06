import queryString from 'query-string';
import { PatientInterface, PatientGetQueryInterface } from 'interfaces/patient';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPatients = async (query?: PatientGetQueryInterface): Promise<PaginatedInterface<PatientInterface>> => {
  return fetcher('/api/patients', {}, query);
};

export const createPatient = async (patient: PatientInterface) => {
  return fetcher('/api/patients', { method: 'POST', body: JSON.stringify(patient) });
};

export const updatePatientById = async (id: string, patient: PatientInterface) => {
  return fetcher(`/api/patients/${id}`, { method: 'PUT', body: JSON.stringify(patient) });
};

export const getPatientById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/patients/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deletePatientById = async (id: string) => {
  return fetcher(`/api/patients/${id}`, { method: 'DELETE' });
};
