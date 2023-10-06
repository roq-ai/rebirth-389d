import * as yup from 'yup';

export const patientSymptomReportValidationSchema = yup.object().shape({
  mood: yup.number().integer().required(),
  streak: yup.number().integer().required(),
  any_severe: yup.boolean().required(),
  any_other_symptoms: yup.boolean().required(),
  patient_id: yup.string().nullable().required(),
});
