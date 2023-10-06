import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { hpcMeetingsValidationSchema } from 'validationSchema/hpc-meetings';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getHpcMeetingsPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getHpcMeetings();
    case 'POST':
      return createHpcMeetings();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getHpcMeetingsPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'hpc_meetings');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.hpc_meetings.count(countOptions as unknown),
      prisma.hpc_meetings.findMany({
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

  async function getHpcMeetings() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.hpc_meetings
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'hpc_meetings'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createHpcMeetings() {
    await hpcMeetingsValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.hpc_decision_makings?.length > 0) {
      const create_hpc_decision_makings = body.hpc_decision_makings;
      body.hpc_decision_makings = {
        create: create_hpc_decision_makings,
      };
    } else {
      delete body.hpc_decision_makings;
    }
    if (body?.hpc_meeting_evaluations?.length > 0) {
      const create_hpc_meeting_evaluations = body.hpc_meeting_evaluations;
      body.hpc_meeting_evaluations = {
        create: create_hpc_meeting_evaluations,
      };
    } else {
      delete body.hpc_meeting_evaluations;
    }
    if (body?.hpc_meeting_members?.length > 0) {
      const create_hpc_meeting_members = body.hpc_meeting_members;
      body.hpc_meeting_members = {
        create: create_hpc_meeting_members,
      };
    } else {
      delete body.hpc_meeting_members;
    }
    const data = await prisma.hpc_meetings.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
