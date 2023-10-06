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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createMemberNotifications } from 'apiSdk/member-notifications';
import { memberNotificationsValidationSchema } from 'validationSchema/member-notifications';
import { PatientInterface } from 'interfaces/patient';
import { UserInterface } from 'interfaces/user';
import { getPatients } from 'apiSdk/patients';
import { getUsers } from 'apiSdk/users';
import { MemberNotificationsInterface } from 'interfaces/member-notifications';

function MemberNotificationsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MemberNotificationsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMemberNotifications(values);
      resetForm();
      router.push('/member-notifications');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MemberNotificationsInterface>({
    initialValues: {
      notification_type: 0,
      read: false,
      next_hpc_meeting_date: new Date(new Date().toDateString()),
      archived: false,
      patient_id: (router.query.patient_id as string) ?? null,
      member_id: (router.query.member_id as string) ?? null,
    },
    validationSchema: memberNotificationsValidationSchema,
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
              label: 'Member Notifications',
              link: '/member-notifications',
            },
            {
              label: 'Create Member Notifications',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Member Notifications
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Notification Type"
            formControlProps={{
              id: 'notification_type',
              isInvalid: !!formik.errors?.notification_type,
            }}
            name="notification_type"
            error={formik.errors?.notification_type}
            value={formik.values?.notification_type}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('notification_type', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="read" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.read}>
            <FormLabel htmlFor="switch-read">Read</FormLabel>
            <Switch id="switch-read" name="read" onChange={formik.handleChange} value={formik.values?.read ? 1 : 0} />
            {formik.errors?.read && <FormErrorMessage>{formik.errors?.read}</FormErrorMessage>}
          </FormControl>
          <FormControl id="next_hpc_meeting_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Next Hpc Meeting Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.next_hpc_meeting_date ? new Date(formik.values?.next_hpc_meeting_date) : null}
              onChange={(value: Date) => formik.setFieldValue('next_hpc_meeting_date', value)}
            />
          </FormControl>

          <FormControl id="archived" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.archived}>
            <FormLabel htmlFor="switch-archived">Archived</FormLabel>
            <Switch
              id="switch-archived"
              name="archived"
              onChange={formik.handleChange}
              value={formik.values?.archived ? 1 : 0}
            />
            {formik.errors?.archived && <FormErrorMessage>{formik.errors?.archived}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PatientInterface>
            formik={formik}
            name={'patient_id'}
            label={'Select Patient'}
            placeholder={'Select Patient'}
            fetcher={getPatients}
            labelField={'email'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'member_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
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
              onClick={() => router.push('/member-notifications')}
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
    entity: 'member_notifications',
    operation: AccessOperationEnum.CREATE,
  }),
)(MemberNotificationsCreatePage);
