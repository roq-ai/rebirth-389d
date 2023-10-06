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

import { createPatient } from 'apiSdk/patients';
import { patientValidationSchema } from 'validationSchema/patients';
import { HospitalInterface } from 'interfaces/hospital';
import { UserInterface } from 'interfaces/user';
import { GeneralPractitionersInterface } from 'interfaces/general-practitioners';
import { getHospitals } from 'apiSdk/hospitals';
import { getUsers } from 'apiSdk/users';
import { getGeneralPractitioners } from 'apiSdk/general-practitioners';
import { PatientInterface } from 'interfaces/patient';

function PatientCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PatientInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPatient(values);
      resetForm();
      router.push('/patients');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PatientInterface>({
    initialValues: {
      status: 0,
      status_date: new Date(new Date().toDateString()),
      status_reason: '',
      citizen_service_number: '',
      first_name: '',
      last_name: '',
      gender: 0,
      birth_date: new Date(new Date().toDateString()),
      phone_number: '',
      email: '',
      tour_done: false,
      treatment_evaluation_done: false,
      active_meeting: '',
      next_hpc_meeting: 0,
      next_hpc_date: new Date(new Date().toDateString()),
      follow_up_status: 0,
      assessed: false,
      emergency_office_hour_number: '',
      emergency_outside_office_hour_number: '',
      living_situation: '',
      primary_caregiver: '',
      informal_care: '',
      formal_care: '',
      hospital_id: (router.query.hospital_id as string) ?? null,
      apn_member_id: (router.query.apn_member_id as string) ?? null,
      general_practitioner_id: (router.query.general_practitioner_id as string) ?? null,
    },
    validationSchema: patientValidationSchema,
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
              label: 'Patients',
              link: '/patients',
            },
            {
              label: 'Create Patient',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Patient
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

          <FormControl id="status_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Status Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.status_date ? new Date(formik.values?.status_date) : null}
              onChange={(value: Date) => formik.setFieldValue('status_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.status_reason}
            label={'Status Reason'}
            props={{
              name: 'status_reason',
              placeholder: 'Status Reason',
              value: formik.values?.status_reason,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.citizen_service_number}
            label={'Citizen Service Number'}
            props={{
              name: 'citizen_service_number',
              placeholder: 'Citizen Service Number',
              value: formik.values?.citizen_service_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.first_name}
            label={'First Name'}
            props={{
              name: 'first_name',
              placeholder: 'First Name',
              value: formik.values?.first_name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.last_name}
            label={'Last Name'}
            props={{
              name: 'last_name',
              placeholder: 'Last Name',
              value: formik.values?.last_name,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Gender"
            formControlProps={{
              id: 'gender',
              isInvalid: !!formik.errors?.gender,
            }}
            name="gender"
            error={formik.errors?.gender}
            value={formik.values?.gender}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('gender', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="birth_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Birth Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.birth_date ? new Date(formik.values?.birth_date) : null}
              onChange={(value: Date) => formik.setFieldValue('birth_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.phone_number}
            label={'Phone Number'}
            props={{
              name: 'phone_number',
              placeholder: 'Phone Number',
              value: formik.values?.phone_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.email}
            label={'Email'}
            props={{
              name: 'email',
              placeholder: 'Email',
              value: formik.values?.email,
              onChange: formik.handleChange,
            }}
          />

          <FormControl id="tour_done" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.tour_done}>
            <FormLabel htmlFor="switch-tour_done">Tour Done</FormLabel>
            <Switch
              id="switch-tour_done"
              name="tour_done"
              onChange={formik.handleChange}
              value={formik.values?.tour_done ? 1 : 0}
            />
            {formik.errors?.tour_done && <FormErrorMessage>{formik.errors?.tour_done}</FormErrorMessage>}
          </FormControl>

          <FormControl
            id="treatment_evaluation_done"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.treatment_evaluation_done}
          >
            <FormLabel htmlFor="switch-treatment_evaluation_done">Treatment Evaluation Done</FormLabel>
            <Switch
              id="switch-treatment_evaluation_done"
              name="treatment_evaluation_done"
              onChange={formik.handleChange}
              value={formik.values?.treatment_evaluation_done ? 1 : 0}
            />
            {formik.errors?.treatment_evaluation_done && (
              <FormErrorMessage>{formik.errors?.treatment_evaluation_done}</FormErrorMessage>
            )}
          </FormControl>

          <TextInput
            error={formik.errors.active_meeting}
            label={'Active Meeting'}
            props={{
              name: 'active_meeting',
              placeholder: 'Active Meeting',
              value: formik.values?.active_meeting,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Next Hpc Meeting"
            formControlProps={{
              id: 'next_hpc_meeting',
              isInvalid: !!formik.errors?.next_hpc_meeting,
            }}
            name="next_hpc_meeting"
            error={formik.errors?.next_hpc_meeting}
            value={formik.values?.next_hpc_meeting}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('next_hpc_meeting', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="next_hpc_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Next Hpc Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.next_hpc_date ? new Date(formik.values?.next_hpc_date) : null}
              onChange={(value: Date) => formik.setFieldValue('next_hpc_date', value)}
            />
          </FormControl>

          <NumberInput
            label="Follow Up Status"
            formControlProps={{
              id: 'follow_up_status',
              isInvalid: !!formik.errors?.follow_up_status,
            }}
            name="follow_up_status"
            error={formik.errors?.follow_up_status}
            value={formik.values?.follow_up_status}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('follow_up_status', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl id="assessed" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.assessed}>
            <FormLabel htmlFor="switch-assessed">Assessed</FormLabel>
            <Switch
              id="switch-assessed"
              name="assessed"
              onChange={formik.handleChange}
              value={formik.values?.assessed ? 1 : 0}
            />
            {formik.errors?.assessed && <FormErrorMessage>{formik.errors?.assessed}</FormErrorMessage>}
          </FormControl>

          <TextInput
            error={formik.errors.emergency_office_hour_number}
            label={'Emergency Office Hour Number'}
            props={{
              name: 'emergency_office_hour_number',
              placeholder: 'Emergency Office Hour Number',
              value: formik.values?.emergency_office_hour_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.emergency_outside_office_hour_number}
            label={'Emergency Outside Office Hour Number'}
            props={{
              name: 'emergency_outside_office_hour_number',
              placeholder: 'Emergency Outside Office Hour Number',
              value: formik.values?.emergency_outside_office_hour_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.living_situation}
            label={'Living Situation'}
            props={{
              name: 'living_situation',
              placeholder: 'Living Situation',
              value: formik.values?.living_situation,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.primary_caregiver}
            label={'Primary Caregiver'}
            props={{
              name: 'primary_caregiver',
              placeholder: 'Primary Caregiver',
              value: formik.values?.primary_caregiver,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.informal_care}
            label={'Informal Care'}
            props={{
              name: 'informal_care',
              placeholder: 'Informal Care',
              value: formik.values?.informal_care,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.formal_care}
            label={'Formal Care'}
            props={{
              name: 'formal_care',
              placeholder: 'Formal Care',
              value: formik.values?.formal_care,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<HospitalInterface>
            formik={formik}
            name={'hospital_id'}
            label={'Select Hospital'}
            placeholder={'Select Hospital'}
            fetcher={getHospitals}
            labelField={'name'}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'apn_member_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            labelField={'email'}
          />
          <AsyncSelect<GeneralPractitionersInterface>
            formik={formik}
            name={'general_practitioner_id'}
            label={'Select General Practitioners'}
            placeholder={'Select General Practitioners'}
            fetcher={getGeneralPractitioners}
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
              onClick={() => router.push('/patients')}
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
    entity: 'patient',
    operation: AccessOperationEnum.CREATE,
  }),
)(PatientCreatePage);
