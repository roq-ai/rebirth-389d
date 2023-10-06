import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware, notificationHandlerMiddleware } from 'server/middlewares';
import { patientSymptomReportValidationSchema } from 'validationSchema/patient-symptom-reports';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  const allowed = await prisma.patient_symptom_report
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      return getPatientSymptomReportById();
    case 'PUT':
      return updatePatientSymptomReportById();
    case 'DELETE':
      return deletePatientSymptomReportById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPatientSymptomReportById() {
    const data = await prisma.patient_symptom_report.findFirst(
      convertQueryToPrismaUtil(req.query, 'patient_symptom_report'),
    );
    return res.status(200).json(data);
  }

  async function updatePatientSymptomReportById() {
    await patientSymptomReportValidationSchema.validate(req.body);
    const data = await prisma.patient_symptom_report.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    await notificationHandlerMiddleware(req, data.id);
    return res.status(200).json(data);
  }
  async function deletePatientSymptomReportById() {
    await notificationHandlerMiddleware(req, req.query.id as string);
    const data = await prisma.patient_symptom_report.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
