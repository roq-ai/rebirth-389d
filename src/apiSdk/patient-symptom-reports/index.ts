import queryString from 'query-string';
import {
  PatientSymptomReportInterface,
  PatientSymptomReportGetQueryInterface,
} from 'interfaces/patient-symptom-report';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPatientSymptomReports = async (
  query?: PatientSymptomReportGetQueryInterface,
): Promise<PaginatedInterface<PatientSymptomReportInterface>> => {
  return fetcher('/api/patient-symptom-reports', {}, query);
};

export const createPatientSymptomReport = async (patientSymptomReport: PatientSymptomReportInterface) => {
  return fetcher('/api/patient-symptom-reports', { method: 'POST', body: JSON.stringify(patientSymptomReport) });
};

export const updatePatientSymptomReportById = async (
  id: string,
  patientSymptomReport: PatientSymptomReportInterface,
) => {
  return fetcher(`/api/patient-symptom-reports/${id}`, { method: 'PUT', body: JSON.stringify(patientSymptomReport) });
};

export const getPatientSymptomReportById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/patient-symptom-reports/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deletePatientSymptomReportById = async (id: string) => {
  return fetcher(`/api/patient-symptom-reports/${id}`, { method: 'DELETE' });
};
