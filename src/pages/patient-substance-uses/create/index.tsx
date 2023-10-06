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

import { createPatientSubstanceUse } from 'apiSdk/patient-substance-uses';
import { patientSubstanceUseValidationSchema } from 'validationSchema/patient-substance-uses';
import { PatientInterface } from 'interfaces/patient';
import { getPatients } from 'apiSdk/patients';
import { PatientSubstanceUseInterface } from 'interfaces/patient-substance-use';

function PatientSubstanceUseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PatientSubstanceUseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPatientSubstanceUse(values);
      resetForm();
      router.push('/patient-substance-uses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PatientSubstanceUseInterface>({
    initialValues: {
      substance_use: '',
      patient_id: (router.query.patient_id as string) ?? null,
    },
    validationSchema: patientSubstanceUseValidationSchema,
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
              label: 'Patient Substance Uses',
              link: '/patient-substance-uses',
            },
            {
              label: 'Create Patient Substance Use',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Patient Substance Use
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.substance_use}
            label={'Substance Use'}
            props={{
              name: 'substance_use',
              placeholder: 'Substance Use',
              value: formik.values?.substance_use,
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
              onClick={() => router.push('/patient-substance-uses')}
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
    entity: 'patient_substance_use',
    operation: AccessOperationEnum.CREATE,
  }),
)(PatientSubstanceUseCreatePage);
