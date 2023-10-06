import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { generalPractitionersValidationSchema } from 'validationSchema/general-practitioners';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getGeneralPractitionersPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getGeneralPractitioners();
    case 'POST':
      return createGeneralPractitioners();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGeneralPractitionersPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'general_practitioners');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.general_practitioners.count(countOptions as unknown),
      prisma.general_practitioners.findMany({
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

  async function getGeneralPractitioners() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.general_practitioners
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'general_practitioners'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createGeneralPractitioners() {
    await generalPractitionersValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.patient?.length > 0) {
      const create_patient = body.patient;
      body.patient = {
        create: create_patient,
      };
    } else {
      delete body.patient;
    }
    const data = await prisma.general_practitioners.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
