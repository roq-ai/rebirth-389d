import * as yup from 'yup';

export const hpcDecisionMakingsValidationSchema = yup.object().shape({
  life_expectancy_without_cancer: yup.string().required(),
  life_expectancy_untreated: yup.string().required(),
  burden_cancer_untreated: yup.string().required(),
  add_life_expectancy: yup.string().required(),
  hpc_meeting_id: yup.string().nullable(),
});
