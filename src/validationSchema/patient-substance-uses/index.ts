import * as yup from 'yup';

export const patientSubstanceUseValidationSchema = yup.object().shape({
  substance_use: yup.string().required(),
  patient_id: yup.string().nullable(),
});
