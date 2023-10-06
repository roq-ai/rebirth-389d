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
import { getHpcDecisionMakingsById, updateHpcDecisionMakingsById } from 'apiSdk/hpc-decision-makings';
import { hpcDecisionMakingsValidationSchema } from 'validationSchema/hpc-decision-makings';
import { HpcDecisionMakingsInterface } from 'interfaces/hpc-decision-makings';
import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';
import { getHpcMeetings } from 'apiSdk/hpc-meetings';

function HpcDecisionMakingsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<HpcDecisionMakingsInterface>(
    () => (id ? `/hpc-decision-makings/${id}` : null),
    () => getHpcDecisionMakingsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HpcDecisionMakingsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHpcDecisionMakingsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/hpc-decision-makings');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<HpcDecisionMakingsInterface>({
    initialValues: data,
    validationSchema: hpcDecisionMakingsValidationSchema,
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
              label: 'Hpc Decision Makings',
              link: '/hpc-decision-makings',
            },
            {
              label: 'Update Hpc Decision Makings',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Hpc Decision Makings
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.life_expectancy_without_cancer}
            label={'Life Expectancy Without Cancer'}
            props={{
              name: 'life_expectancy_without_cancer',
              placeholder: 'Life Expectancy Without Cancer',
              value: formik.values?.life_expectancy_without_cancer,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.life_expectancy_untreated}
            label={'Life Expectancy Untreated'}
            props={{
              name: 'life_expectancy_untreated',
              placeholder: 'Life Expectancy Untreated',
              value: formik.values?.life_expectancy_untreated,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.burden_cancer_untreated}
            label={'Burden Cancer Untreated'}
            props={{
              name: 'burden_cancer_untreated',
              placeholder: 'Burden Cancer Untreated',
              value: formik.values?.burden_cancer_untreated,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.add_life_expectancy}
            label={'Add Life Expectancy'}
            props={{
              name: 'add_life_expectancy',
              placeholder: 'Add Life Expectancy',
              value: formik.values?.add_life_expectancy,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<HpcMeetingsInterface>
            formik={formik}
            name={'hpc_meeting_id'}
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
              onClick={() => router.push('/hpc-decision-makings')}
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
    entity: 'hpc_decision_makings',
    operation: AccessOperationEnum.UPDATE,
  }),
)(HpcDecisionMakingsEditPage);
