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
import { getPatientSymptomReportById, updatePatientSymptomReportById } from 'apiSdk/patient-symptom-reports';
import { patientSymptomReportValidationSchema } from 'validationSchema/patient-symptom-reports';
import { PatientSymptomReportInterface } from 'interfaces/patient-symptom-report';
import { PatientInterface } from 'interfaces/patient';
import { getPatients } from 'apiSdk/patients';

function PatientSymptomReportEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<PatientSymptomReportInterface>(
    () => (id ? `/patient-symptom-reports/${id}` : null),
    () => getPatientSymptomReportById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PatientSymptomReportInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePatientSymptomReportById(id, values);
      mutate(updated);
      resetForm();
      router.push('/patient-symptom-reports');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<PatientSymptomReportInterface>({
    initialValues: data,
    validationSchema: patientSymptomReportValidationSchema,
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
              label: 'Patient Symptom Reports',
              link: '/patient-symptom-reports',
            },
            {
              label: 'Update Patient Symptom Report',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Patient Symptom Report
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Mood"
            formControlProps={{
              id: 'mood',
              isInvalid: !!formik.errors?.mood,
            }}
            name="mood"
            error={formik.errors?.mood}
            value={formik.values?.mood}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('mood', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Streak"
            formControlProps={{
              id: 'streak',
              isInvalid: !!formik.errors?.streak,
            }}
            name="streak"
            error={formik.errors?.streak}
            value={formik.values?.streak}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('streak', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <FormControl
            id="any_severe"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.any_severe}
          >
            <FormLabel htmlFor="switch-any_severe">Any Severe</FormLabel>
            <Switch
              id="switch-any_severe"
              name="any_severe"
              onChange={formik.handleChange}
              value={formik.values?.any_severe ? 1 : 0}
            />
            {formik.errors?.any_severe && <FormErrorMessage>{formik.errors?.any_severe}</FormErrorMessage>}
          </FormControl>

          <FormControl
            id="any_other_symptoms"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.any_other_symptoms}
          >
            <FormLabel htmlFor="switch-any_other_symptoms">Any Other Symptoms</FormLabel>
            <Switch
              id="switch-any_other_symptoms"
              name="any_other_symptoms"
              onChange={formik.handleChange}
              value={formik.values?.any_other_symptoms ? 1 : 0}
            />
            {formik.errors?.any_other_symptoms && (
              <FormErrorMessage>{formik.errors?.any_other_symptoms}</FormErrorMessage>
            )}
          </FormControl>
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
              onClick={() => router.push('/patient-symptom-reports')}
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
    entity: 'patient_symptom_report',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PatientSymptomReportEditPage);
