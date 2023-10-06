import * as yup from 'yup';

export const newTablepatientTreatmentsValidationSchema = yup.object().shape({
  patient_id: yup.string().nullable(),
});
