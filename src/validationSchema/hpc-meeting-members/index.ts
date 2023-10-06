import * as yup from 'yup';

export const hpcMeetingMembersValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
  hpc_meetings_id: yup.string().nullable(),
});
