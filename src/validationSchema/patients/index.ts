import * as yup from 'yup';

export const patientValidationSchema = yup.object().shape({
  status: yup.number().integer().required(),
  status_date: yup.date().nullable(),
  status_reason: yup.string().nullable(),
  citizen_service_number: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  gender: yup.number().integer().required(),
  birth_date: yup.date().required(),
  phone_number: yup.string().nullable(),
  email: yup.string().nullable(),
  tour_done: yup.boolean().required(),
  treatment_evaluation_done: yup.boolean().required(),
  active_meeting: yup.string().nullable(),
  next_hpc_meeting: yup.number().integer().required(),
  next_hpc_date: yup.date().nullable(),
  follow_up_status: yup.number().integer().required(),
  assessed: yup.boolean().required(),
  emergency_office_hour_number: yup.string().nullable(),
  emergency_outside_office_hour_number: yup.string().nullable(),
  living_situation: yup.string().nullable(),
  primary_caregiver: yup.string().nullable(),
  informal_care: yup.string().nullable(),
  formal_care: yup.string().nullable(),
  hospital_id: yup.string().nullable(),
  apn_member_id: yup.string().nullable(),
  general_practitioner_id: yup.string().nullable(),
});
