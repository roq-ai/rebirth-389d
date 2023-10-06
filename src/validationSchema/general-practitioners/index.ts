import * as yup from 'yup';

export const generalPractitionersValidationSchema = yup.object().shape({
  last_name: yup.string().required(),
  email: yup.string().required(),
  personal_phone: yup.string().required(),
  office_phone: yup.string().required(),
});
