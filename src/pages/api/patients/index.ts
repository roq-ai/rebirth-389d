import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
  notificationHandlerMiddleware,
} from 'server/middlewares';
import { patientValidationSchema } from 'validationSchema/patients';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';
import omit from 'lodash/omit';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req);
  if (!session) {
    if (req.method === 'GET') {
      return getPatientsPublic();
    }
    return res.status(403).json({ message: `Forbidden` });
  }
  const { roqUserId, user } = session;
  switch (req.method) {
    case 'GET':
      return getPatients();
    case 'POST':
      return createPatient();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPatientsPublic() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const findOptions = convertQueryToPrismaUtil(query, 'patient');
    const countOptions = omit(findOptions, 'include');
    const [totalCount, data] = await prisma.$transaction([
      prisma.patient.count(countOptions as unknown),
      prisma.patient.findMany({
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

  async function getPatients() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.patient
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, 'patient'),
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createPatient() {
    await patientValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.hpc_meetings?.length > 0) {
      const create_hpc_meetings = body.hpc_meetings;
      body.hpc_meetings = {
        create: create_hpc_meetings,
      };
    } else {
      delete body.hpc_meetings;
    }
    if (body?.member_notifications?.length > 0) {
      const create_member_notifications = body.member_notifications;
      body.member_notifications = {
        create: create_member_notifications,
      };
    } else {
      delete body.member_notifications;
    }
    if (body?.new_tablepatient_treatments?.length > 0) {
      const create_new_tablepatient_treatments = body.new_tablepatient_treatments;
      body.new_tablepatient_treatments = {
        create: create_new_tablepatient_treatments,
      };
    } else {
      delete body.new_tablepatient_treatments;
    }
    if (body?.patient_substance_use?.length > 0) {
      const create_patient_substance_use = body.patient_substance_use;
      body.patient_substance_use = {
        create: create_patient_substance_use,
      };
    } else {
      delete body.patient_substance_use;
    }
    if (body?.patient_symptom_report?.length > 0) {
      const create_patient_symptom_report = body.patient_symptom_report;
      body.patient_symptom_report = {
        create: create_patient_symptom_report,
      };
    } else {
      delete body.patient_symptom_report;
    }
    const data = await prisma.patient.create({
      data: body,
    });
    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
