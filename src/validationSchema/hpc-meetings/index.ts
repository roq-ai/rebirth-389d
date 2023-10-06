import * as yup from 'yup';

export const hpcMeetingsValidationSchema = yup.object().shape({
  status: yup.number().integer().required(),
  meeting_type: yup.number().integer().required(),
  date: yup.date().required(),
  current_step: yup.number().integer().nullable(),
  number: yup.number().integer().nullable(),
  snapshot_id: yup.string().nullable(),
  patient_id: yup.string().nullable(),
});
