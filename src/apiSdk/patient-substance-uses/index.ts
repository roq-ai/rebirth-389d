import queryString from 'query-string';
import { PatientSubstanceUseInterface, PatientSubstanceUseGetQueryInterface } from 'interfaces/patient-substance-use';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPatientSubstanceUses = async (
  query?: PatientSubstanceUseGetQueryInterface,
): Promise<PaginatedInterface<PatientSubstanceUseInterface>> => {
  return fetcher('/api/patient-substance-uses', {}, query);
};

export const createPatientSubstanceUse = async (patientSubstanceUse: PatientSubstanceUseInterface) => {
  return fetcher('/api/patient-substance-uses', { method: 'POST', body: JSON.stringify(patientSubstanceUse) });
};

export const updatePatientSubstanceUseById = async (id: string, patientSubstanceUse: PatientSubstanceUseInterface) => {
  return fetcher(`/api/patient-substance-uses/${id}`, { method: 'PUT', body: JSON.stringify(patientSubstanceUse) });
};

export const getPatientSubstanceUseById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/patient-substance-uses/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deletePatientSubstanceUseById = async (id: string) => {
  return fetcher(`/api/patient-substance-uses/${id}`, { method: 'DELETE' });
};
