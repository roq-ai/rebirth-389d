import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { memberNotificationsValidationSchema } from 'validationSchema/member-notifications';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getMemberNotificationsPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getMemberNotifications();
    case 'POST':
      return createMemberNotifications();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMemberNotificationsPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'member_notifications');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.member_notifications.count(countOptions as unknown),
      prisma.member_notifications.findMany({
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
        ...findOptions,
      }),
    ]);
    return res.status(200).json({ totalCount, data });
  }

  async function getMemberNotifications() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.member_notifications
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'member_notifications'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createMemberNotifications() {
    await memberNotificationsValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.member_notifications.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
