import queryString from 'query-string';
import { MemberNotificationsInterface, MemberNotificationsGetQueryInterface } from 'interfaces/member-notifications';
import { fetcher } from 'lib/api-fetcher';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getMemberNotifications = async (
  query?: MemberNotificationsGetQueryInterface,
): Promise<PaginatedInterface<MemberNotificationsInterface>> => {
  return fetcher('/api/member-notifications', {}, query);
};

export const createMemberNotifications = async (memberNotifications: MemberNotificationsInterface) => {
  return fetcher('/api/member-notifications', { method: 'POST', body: JSON.stringify(memberNotifications) });
};

export const updateMemberNotificationsById = async (id: string, memberNotifications: MemberNotificationsInterface) => {
  return fetcher(`/api/member-notifications/${id}`, { method: 'PUT', body: JSON.stringify(memberNotifications) });
};

export const getMemberNotificationsById = async (id: string, query?: GetQueryInterface) => {
  return fetcher(`/api/member-notifications/${id}${query ? `?${queryString.stringify(query)}` : ''}`, {});
};

export const deleteMemberNotificationsById = async (id: string) => {
  return fetcher(`/api/member-notifications/${id}`, { method: 'DELETE' });
};
