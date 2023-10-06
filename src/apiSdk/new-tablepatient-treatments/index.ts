import queryString from 'query-string';
import {
  NewTablepatientTreatmentsInterface,
  NewTablepatientTreatmentsGetQueryInterface,
} from 'interfaces/new-tablepatient-treatments';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getNewTablepatientTreatments = async (
  query?: NewTablepatientTreatmentsGetQueryInterface,
): Promise<PaginatedInterface<NewTablepatientTreatmentsInterface>> => {
  return fetcher('/api/new-tablepatient-treatments', {}, query);
};

export const createNewTablepatientTreatments = async (
  newTablepatientTreatments: NewTablepatientTreatmentsInterface,
) => {
  return fetcher('/api/new-tablepatient-treatments', {
    method: 'POST',
    body: JSON.stringify(newTablepatientTreatments),
  });
};

export const updateNewTablepatientTreatmentsById = async (
  id: string,
  newTablepatientTreatments: NewTablepatientTreatmentsInterface,
) => {
  return fetcher(`/api/new-tablepatient-treatments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(newTablepatientTreatments),
  });
};

export const getNewTablepatientTreatmentsById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/new-tablepatient-treatments/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteNewTablepatientTreatmentsById = async (id: string) => {
  return fetcher(`/api/new-tablepatient-treatments/${id}`, { method: 'DELETE' });
};
