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
import { getHpcMeetingEvaluationsById, updateHpcMeetingEvaluationsById } from 'apiSdk/hpc-meeting-evaluations';
import { hpcMeetingEvaluationsValidationSchema } from 'validationSchema/hpc-meeting-evaluations';
import { HpcMeetingEvaluationsInterface } from 'interfaces/hpc-meeting-evaluations';
import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';
import { getHpcMeetings } from 'apiSdk/hpc-meetings';

function HpcMeetingEvaluationsEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<HpcMeetingEvaluationsInterface>(
    () => (id ? `/hpc-meeting-evaluations/${id}` : null),
    () => getHpcMeetingEvaluationsById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: HpcMeetingEvaluationsInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateHpcMeetingEvaluationsById(id, values);
      mutate(updated);
      resetForm();
      router.push('/hpc-meeting-evaluations');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<HpcMeetingEvaluationsInterface>({
    initialValues: data,
    validationSchema: hpcMeetingEvaluationsValidationSchema,
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
              label: 'Hpc Meeting Evaluations',
              link: '/hpc-meeting-evaluations',
            },
            {
              label: 'Update Hpc Meeting Evaluations',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Hpc Meeting Evaluations
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.treatment_information}
            label={'Treatment Information'}
            props={{
              name: 'treatment_information',
              placeholder: 'Treatment Information',
              value: formik.values?.treatment_information,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.issues_since_last_review}
            label={'Issues Since Last Review'}
            props={{
              name: 'issues_since_last_review',
              placeholder: 'Issues Since Last Review',
              value: formik.values?.issues_since_last_review,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.extra_support_needed}
            label={'Extra Support Needed'}
            props={{
              name: 'extra_support_needed',
              placeholder: 'Extra Support Needed',
              value: formik.values?.extra_support_needed,
              onChange: formik.handleChange,
            }}
          />

          <FormControl
            id="treatment_plan_changed"
            display="flex"
            alignItems="center"
            mb="4"
            isInvalid={!!formik.errors?.treatment_plan_changed}
          >
            <FormLabel htmlFor="switch-treatment_plan_changed">Treatment Plan Changed</FormLabel>
            <Switch
              id="switch-treatment_plan_changed"
              name="treatment_plan_changed"
              onChange={formik.handleChange}
              value={formik.values?.treatment_plan_changed ? 1 : 0}
            />
            {formik.errors?.treatment_plan_changed && (
              <FormErrorMessage>{formik.errors?.treatment_plan_changed}</FormErrorMessage>
            )}
          </FormControl>

          <TextInput
            error={formik.errors.treatment_plan_changed_how}
            label={'Treatment Plan Changed How'}
            props={{
              name: 'treatment_plan_changed_how',
              placeholder: 'Treatment Plan Changed How',
              value: formik.values?.treatment_plan_changed_how,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.treatment_plan_changed_other}
            label={'Treatment Plan Changed Other'}
            props={{
              name: 'treatment_plan_changed_other',
              placeholder: 'Treatment Plan Changed Other',
              value: formik.values?.treatment_plan_changed_other,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.treatmen_plan_changed_why}
            label={'Treatmen Plan Changed Why'}
            props={{
              name: 'treatmen_plan_changed_why',
              placeholder: 'Treatmen Plan Changed Why',
              value: formik.values?.treatmen_plan_changed_why,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.how_successfull}
            label={'How Successfull'}
            props={{
              name: 'how_successfull',
              placeholder: 'How Successfull',
              value: formik.values?.how_successfull,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.any_further_recommandations}
            label={'Any Further Recommandations'}
            props={{
              name: 'any_further_recommandations',
              placeholder: 'Any Further Recommandations',
              value: formik.values?.any_further_recommandations,
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
              onClick={() => router.push('/hpc-meeting-evaluations')}
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
    entity: 'hpc_meeting_evaluations',
    operation: AccessOperationEnum.UPDATE,
  }),
)(HpcMeetingEvaluationsEditPage);
