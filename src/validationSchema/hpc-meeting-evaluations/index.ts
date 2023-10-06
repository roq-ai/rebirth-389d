import * as yup from 'yup';

export const hpcMeetingEvaluationsValidationSchema = yup.object().shape({
  treatment_information: yup.string().required(),
  issues_since_last_review: yup.string().required(),
  extra_support_needed: yup.string().required(),
  treatment_plan_changed: yup.boolean().required(),
  treatment_plan_changed_how: yup.string().required(),
  treatment_plan_changed_other: yup.string().nullable(),
  treatmen_plan_changed_why: yup.string().required(),
  how_successfull: yup.string().required(),
  any_further_recommandations: yup.string().required(),
  hpc_meeting_id: yup.string().nullable(),
});
