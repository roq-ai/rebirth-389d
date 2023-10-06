import * as yup from 'yup';

export const hospitalValidationSchema = yup.object().shape({
  description: yup.string().nullable(),
  status: yup.number().integer().nullable(),
  name: yup.string().required(),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  identifier: yup.string().nullable(),
  postal_code: yup.string().nullable(),
  country: yup.string().nullable(),
  language: yup.string().nullable(),
  user_id: yup.string().nullable().required(),
});
