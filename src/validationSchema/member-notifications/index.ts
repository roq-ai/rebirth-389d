import * as yup from 'yup';

export const memberNotificationsValidationSchema = yup.object().shape({
  notification_type: yup.number().integer().required(),
  read: yup.boolean().required(),
  next_hpc_meeting_date: yup.date().nullable(),
  archived: yup.boolean().required(),
  patient_id: yup.string().nullable(),
  member_id: yup.string().nullable(),
});
