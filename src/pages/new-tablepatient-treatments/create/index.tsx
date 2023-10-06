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

import { createNewTablepatientTreatments } from 'apiSdk/new-tablepatient-treatments';
import { newTablepatientTreatmentsValidationSchema } from 'validationSchema/new-tablepatient-treatments';
import { PatientInterface } from 'interfaces/patient';
import { getPatients } from 'apiSdk/patients';
import { NewTablepatientTreatmentsInterface } from 'interfaces/new-tablepatient-treatments';

function NewTablepatientTreatmentsCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: NewTablepatientTreatmentsInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createNewTablepatientTreatments(values);
      resetForm();
      router.push('/new-tablepatient-treatments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<NewTablepatientTreatmentsInterface>({
    initialValues: {
      patient_id: (router.query.patient_id as string) ?? null,
    },
    validationSchema: newTablepatientTreatmentsValidationSchema,
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
              label: 'New Tablepatient Treatments',
              link: '/new-tablepatient-treatments',
            },
            {
              label: 'Create New Tablepatient Treatments',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create New Tablepatient Treatments
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
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
              onClick={() => router.push('/new-tablepatient-treatments')}
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
    entity: 'new_tablepatient_treatments',
    operation: AccessOperationEnum.CREATE,
  }),
)(NewTablepatientTreatmentsCreatePage);
