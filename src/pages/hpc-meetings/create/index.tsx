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

import { createHpcMeetings } from 'apiSdk/hpc-meetings';
import { hpcMeetingsValidationSchema } from 'validationSchema/hpc-meetings';
import { PatientInterface } from 'interfaces/patient';
import { getPatients } from 'apiSdk/patients';
import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';

function HpcMeetingsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: HpcMeetingsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createHpcMeetings(values);
      resetForm();
      router.push('/hpc-meetings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<HpcMeetingsInterface>({
    initialValues: {
      status: 0,
      meeting_type: 0,
      date: new Date(new Date().toDateString()),
      current_step: 0,
      number: 0,
      snapshot_id: '',
      patient_id: (router.query.patient_id as string) ?? null,
    },
    validationSchema: hpcMeetingsValidationSchema,
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
              label: 'Hpc Meetings',
              link: '/hpc-meetings',
            },
            {
              label: 'Create Hpc Meetings',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Hpc Meetings
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Status"
            formControlProps={{
              id: 'status',
              isInvalid: !!formik.errors?.status,
            }}
            name="status"
            error={formik.errors?.status}
            value={formik.values?.status}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('status', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Meeting Type"
            formControlProps={{
              id: 'meeting_type',
              isInvalid: !!formik.errors?.meeting_type,
            }}
            name="meeting_type"
            error={formik.errors?.meeting_type}
            value={formik.values?.meeting_type}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('meeting_type', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.date ? new Date(formik.values?.date) : null}
              onChange={(value: Date) => formik.setFieldValue('date', value)}
            />
          </FormControl>

          <NumberInput
            label="Current Step"
            formControlProps={{
              id: 'current_step',
              isInvalid: !!formik.errors?.current_step,
            }}
            name="current_step"
            error={formik.errors?.current_step}
            value={formik.values?.current_step}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('current_step', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Number"
            formControlProps={{
              id: 'number',
              isInvalid: !!formik.errors?.number,
            }}
            name="number"
            error={formik.errors?.number}
            value={formik.values?.number}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('number', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.snapshot_id}
            label={'Snapshot Id'}
            props={{
              name: 'snapshot_id',
              placeholder: 'Snapshot Id',
              value: formik.values?.snapshot_id,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<PatientInterface>
            formik={formik}
            name={'patient_id'}
            label={'Select Patient'}
            placeholder={'Select Patient'}
            fetcher={getPatients}
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
              onClick={() => router.push('/hpc-meetings')}
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
    entity: 'hpc_meetings',
    operation: AccessOperationEnum.CREATE,
  }),
)(HpcMeetingsCreatePage);
