import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getHpcMeetingMembersById, updateHpcMeetingMembersById } from 'apiSdk/hpc-meeting-members';
import { hpcMeetingMembersValidationSchema } from 'validationSchema/hpc-meeting-members';
import { HpcMeetingMembersInterface } from 'interfaces/hpc-meeting-members';
import { UserInterface } from 'interfaces/user';
import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';
import { getUsers } from 'apiSdk/users';
import { getHpcMeetings } from 'apiSdk/hpc-meetings';

function HpcMeetingMembersEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<HpcMeetingMembersInterface>(
    () => (id ? `/hpc-meeting-members/${id}` : null),
    () => getHpcMeetingMembersById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HpcMeetingMembersInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHpcMeetingMembersById(id, values);
      mutate(updated);
      resetForm();
      router.push('/hpc-meeting-members');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<HpcMeetingMembersInterface>({
    initialValues: data,
    validationSchema: hpcMeetingMembersValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Hpc Meeting Members',
              link: '/hpc-meeting-members',
            },
            {
              label: 'Update Hpc Meeting Members',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Hpc Meeting Members
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<HpcMeetingsInterface>
            formik={formik}
            name={'hpc_meetings_id'}
            label={'Select Hpc Meetings'}
            placeholder={'Select Hpc Meetings'}
            fetcher={getHpcMeetings}
            labelField={'snapshot_id'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/hpc-meeting-members')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'hpc_meeting_members',
    operation: AccessOperationEnum.UPDATE,
  }),
)(HpcMeetingMembersEditPage);
