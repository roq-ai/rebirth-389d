import { Box, Center, Flex, Link, List, ListItem, Spinner, Stack, Text, Image, Button } from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import { Error } from 'components/error';
import { FormListItem } from 'components/form-list-item';
import { FormWrapper } from 'components/form-wrapper';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { routes } from 'routes';
import useSWR from 'swr';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { UserPageTable } from 'components/user-page-table';
import { EntityImage } from 'components/entity-image';
import { FiEdit2 } from 'react-icons/fi';

import { getPatientById } from 'apiSdk/patients';
import { PatientInterface } from 'interfaces/patient';
import { HpcMeetingsListPage } from 'pages/hpc-meetings';
import { MemberNotificationsListPage } from 'pages/member-notifications';
import { NewTablepatientTreatmentsListPage } from 'pages/new-tablepatient-treatments';
import { PatientSubstanceUseListPage } from 'pages/patient-substance-uses';
import { PatientSymptomReportListPage } from 'pages/patient-symptom-reports';

function PatientViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PatientInterface>(
    () => (id ? `/patients/${id}` : null),
    () =>
      getPatientById(id, {
        relations: ['hospital', 'user', 'general_practitioners'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

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
              label: 'Patient Details',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper wrapperProps={{ border: 'none', gap: 3, p: 0 }}>
              <Flex alignItems="center" w="full" justifyContent={'space-between'}>
                <Box>
                  <Text
                    sx={{
                      fontSize: '1.875rem',
                      fontWeight: 700,
                      color: 'base.content',
                    }}
                  >
                    Patient Details
                  </Text>
                </Box>
                {hasAccess('patient', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                  <NextLink href={`/patients/edit/${id}`} passHref legacyBehavior>
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      mr={2}
                      padding="0rem 0.5rem"
                      height="24px"
                      fontSize="0.75rem"
                      variant="outline"
                      color="state.info.main"
                      borderRadius="6px"
                      border="1px"
                      borderColor="state.info.transparent"
                      leftIcon={<FiEdit2 width="12px" height="12px" color="state.info.main" />}
                    >
                      Edit
                    </Button>
                  </NextLink>
                )}
              </Flex>

              <List
                w="100%"
                css={{
                  '> li:not(:last-child)': {
                    borderBottom: '1px solid var(--chakra-colors-base-300)',
                  },
                }}
              >
                <FormListItem
                  label="Created At"
                  text={data?.created_at ? format(parseISO(data?.created_at as unknown as string), 'dd-MM-yyyy') : ''}
                />

                <FormListItem
                  label="Updated At"
                  text={data?.updated_at ? format(parseISO(data?.updated_at as unknown as string), 'dd-MM-yyyy') : ''}
                />

                <FormListItem label="Status" text={data?.status} />

                <FormListItem
                  label="Status Date"
                  text={data?.status_date ? format(parseISO(data?.status_date as unknown as string), 'dd-MM-yyyy') : ''}
                />

                <FormListItem label="Status Reason" text={data?.status_reason} />

                <FormListItem label="Citizen Service Number" text={data?.citizen_service_number} />

                <FormListItem label="First Name" text={data?.first_name} />

                <FormListItem label="Last Name" text={data?.last_name} />

                <FormListItem label="Gender" text={data?.gender} />

                <FormListItem
                  label="Birth Date"
                  text={data?.birth_date ? format(parseISO(data?.birth_date as unknown as string), 'dd-MM-yyyy') : ''}
                />

                <FormListItem label="Phone Number" text={data?.phone_number} />

                <FormListItem label="Email" text={data?.email} />

                <FormListItem label="Tour Done" text={data?.tour_done} />

                <FormListItem label="Treatment Evaluation Done" text={data?.treatment_evaluation_done} />

                <FormListItem label="Active Meeting" text={data?.active_meeting} />

                <FormListItem label="Next Hpc Meeting" text={data?.next_hpc_meeting} />

                <FormListItem
                  label="Next Hpc Date"
                  text={
                    data?.next_hpc_date ? format(parseISO(data?.next_hpc_date as unknown as string), 'dd-MM-yyyy') : ''
                  }
                />

                <FormListItem label="Follow Up Status" text={data?.follow_up_status} />

                <FormListItem label="Assessed" text={data?.assessed} />

                <FormListItem label="Emergency Office Hour Number" text={data?.emergency_office_hour_number} />

                <FormListItem
                  label="Emergency Outside Office Hour Number"
                  text={data?.emergency_outside_office_hour_number}
                />

                <FormListItem label="Living Situation" text={data?.living_situation} />

                <FormListItem label="Primary Caregiver" text={data?.primary_caregiver} />

                <FormListItem label="Informal Care" text={data?.informal_care} />

                <FormListItem label="Formal Care" text={data?.formal_care} />

                {hasAccess('hospital', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Hospital"
                    text={
                      <Link as={NextLink} href={`/hospitals/view/${data?.hospital?.id}`}>
                        {data?.hospital?.name}
                      </Link>
                    }
                  />
                )}
                {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="User"
                    text={
                      <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                        {data?.user?.email}
                      </Link>
                    }
                  />
                )}
                {hasAccess('general_practitioners', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="General Practitioners"
                    text={
                      <Link as={NextLink} href={`/general-practitioners/view/${data?.general_practitioners?.id}`}>
                        {data?.general_practitioners?.email}
                      </Link>
                    }
                  />
                )}
              </List>
            </FormWrapper>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={6} p={'18px'}>
              <HpcMeetingsListPage
                filters={{ patient_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                showSearchFilter={false}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={6} p={'18px'}>
              <MemberNotificationsListPage
                filters={{ patient_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                showSearchFilter={false}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={6} p={'18px'}>
              <NewTablepatientTreatmentsListPage
                filters={{ patient_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                showSearchFilter={false}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={6} p={'18px'}>
              <PatientSubstanceUseListPage
                filters={{ patient_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                showSearchFilter={false}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box borderRadius="10px" border="1px" borderColor={'base.300'} mt={6} p={'18px'}>
              <PatientSymptomReportListPage
                filters={{ patient_id: id }}
                hidePagination={true}
                hideTableBorders={true}
                showSearchFilter={false}
                pageSize={5}
                titleProps={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              />
            </Box>
          </>
        )}
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
    operation: AccessOperationEnum.READ,
  }),
)(PatientViewPage);
