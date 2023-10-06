import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  withAuthorization,
  useAuthorizationApi,
} from '@roq/nextjs';
import { compose } from 'lib/compose';
import { Box, Button, Flex, IconButton, Link, Text, TextProps } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { Error } from 'components/error';
import { SearchInput } from 'components/search-input';
import Table from 'components/table';
import { useDataTableParams, ListDataFiltersType } from 'components/table/hook/use-data-table-params.hook';
import { DATE_TIME_FORMAT } from 'const';
import d from 'dayjs';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash } from 'react-icons/fi';
import useSWR from 'swr';
import { PaginatedInterface } from 'interfaces';
import { withAppLayout } from 'lib/hocs/with-app-layout.hoc';
import { AccessInfo } from 'components/access-info';
import { getPatients, deletePatientById } from 'apiSdk/patients';
import { PatientInterface } from 'interfaces/patient';

type ColumnType = ColumnDef<PatientInterface, unknown>;

interface PatientListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function PatientListPage(props: PatientListPageProps) {
  const {
    filters = {},
    titleProps = {},
    showSearchFilter = true,
    hidePagination,
    hideTableBorders,
    pageSize,
    tableOnly,
    hideActions,
  } = props;
  const { hasAccess } = useAuthorizationApi();
  const { onFiltersChange, onSearchTermChange, params, onPageChange, onPageSizeChange, setParams } = useDataTableParams(
    {
      filters,
      searchTerm: '',
      pageSize,
      order: [
        {
          desc: true,
          id: 'created_at',
        },
      ],
    },
  );

  const fetcher = useCallback(
    async () =>
      getPatients({
        relations: [
          'hospital',
          'user',
          'general_practitioners',
          'hpc_meetings.count',
          'member_notifications.count',
          'new_tablepatient_treatments.count',
          'patient_substance_use.count',
          'patient_symptom_report.count',
        ],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: [
          'status_reason.contains',
          'citizen_service_number.contains',
          'first_name.contains',
          'last_name.contains',
          'phone_number.contains',
          'email.contains',
          'active_meeting.contains',
          'emergency_office_hour_number.contains',
          'emergency_outside_office_hour_number.contains',
          'living_situation.contains',
          'primary_caregiver.contains',
          'informal_care.contains',
          'formal_care.contains',
        ],
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<PatientInterface>>(
    () => `/patients?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePatientById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: PatientInterface) => {
    if (hasAccess('patient', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/patients/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    { id: 'status', header: 'status', accessorKey: 'status' },
    {
      id: 'status_date',
      header: 'Status Date',
      accessorKey: 'status_date',
      cell: ({ row: { original: record } }: any) =>
        record?.status_date ? format(parseISO(record?.status_date as unknown as string), 'dd-MM-yyyy') : '',
    },
    { id: 'status_reason', header: 'Status Reason', accessorKey: 'status_reason' },
    { id: 'citizen_service_number', header: 'Citizen Service Number', accessorKey: 'citizen_service_number' },
    { id: 'first_name', header: 'First Name', accessorKey: 'first_name' },
    { id: 'last_name', header: 'Last Name', accessorKey: 'last_name' },
    { id: 'gender', header: 'gender', accessorKey: 'gender' },
    {
      id: 'birth_date',
      header: 'Birth Date',
      accessorKey: 'birth_date',
      cell: ({ row: { original: record } }: any) =>
        record?.birth_date ? format(parseISO(record?.birth_date as unknown as string), 'dd-MM-yyyy') : '',
    },
    { id: 'phone_number', header: 'Phone Number', accessorKey: 'phone_number' },
    { id: 'email', header: 'Email', accessorKey: 'email' },
    { id: 'tour_done', header: 'Tour Done', accessorKey: 'tour_done' },
    { id: 'treatment_evaluation_done', header: 'Treatment Evaluation Done', accessorKey: 'treatment_evaluation_done' },
    { id: 'active_meeting', header: 'Active Meeting', accessorKey: 'active_meeting' },
    { id: 'next_hpc_meeting', header: 'next_hpc_meeting', accessorKey: 'next_hpc_meeting' },
    {
      id: 'next_hpc_date',
      header: 'Next Hpc Date',
      accessorKey: 'next_hpc_date',
      cell: ({ row: { original: record } }: any) =>
        record?.next_hpc_date ? format(parseISO(record?.next_hpc_date as unknown as string), 'dd-MM-yyyy') : '',
    },
    { id: 'follow_up_status', header: 'follow_up_status', accessorKey: 'follow_up_status' },
    { id: 'assessed', header: 'Assessed', accessorKey: 'assessed' },
    {
      id: 'emergency_office_hour_number',
      header: 'Emergency Office Hour Number',
      accessorKey: 'emergency_office_hour_number',
    },
    {
      id: 'emergency_outside_office_hour_number',
      header: 'Emergency Outside Office Hour Number',
      accessorKey: 'emergency_outside_office_hour_number',
    },
    { id: 'living_situation', header: 'Living Situation', accessorKey: 'living_situation' },
    { id: 'primary_caregiver', header: 'Primary Caregiver', accessorKey: 'primary_caregiver' },
    { id: 'informal_care', header: 'Informal Care', accessorKey: 'informal_care' },
    { id: 'formal_care', header: 'Formal Care', accessorKey: 'formal_care' },
    hasAccess('hospital', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'hospital',
          header: 'Hospital',
          accessorKey: 'hospital',
          cell: ({ row: { original: record } }: any) => (
            <Link as={NextLink} onClick={(e) => e.stopPropagation()} href={`/hospitals/view/${record.hospital?.id}`}>
              {record.hospital?.name}
            </Link>
          ),
        }
      : null,
    hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'user',
          header: 'User',
          accessorKey: 'user',
          cell: ({ row: { original: record } }: any) => (
            <Link as={NextLink} onClick={(e) => e.stopPropagation()} href={`/users/view/${record.user?.id}`}>
              {record.user?.email}
            </Link>
          ),
        }
      : null,
    hasAccess('general_practitioners', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'general_practitioners',
          header: 'General Practitioners',
          accessorKey: 'general_practitioners',
          cell: ({ row: { original: record } }: any) => (
            <Link
              as={NextLink}
              onClick={(e) => e.stopPropagation()}
              href={`/general-practitioners/view/${record.general_practitioners?.id}`}
            >
              {record.general_practitioners?.email}
            </Link>
          ),
        }
      : null,
    hasAccess('hpc_meetings', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'hpc_meetings',
          header: 'Hpc Meetings',
          accessorKey: 'hpc_meetings',
          cell: ({ row: { original: record } }: any) => record?._count?.hpc_meetings,
        }
      : null,
    hasAccess('member_notifications', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'member_notifications',
          header: 'Member Notifications',
          accessorKey: 'member_notifications',
          cell: ({ row: { original: record } }: any) => record?._count?.member_notifications,
        }
      : null,
    hasAccess('new_tablepatient_treatments', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'new_tablepatient_treatments',
          header: 'New Tablepatient Treatments',
          accessorKey: 'new_tablepatient_treatments',
          cell: ({ row: { original: record } }: any) => record?._count?.new_tablepatient_treatments,
        }
      : null,
    hasAccess('patient_substance_use', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'patient_substance_use',
          header: 'Patient Substance Use',
          accessorKey: 'patient_substance_use',
          cell: ({ row: { original: record } }: any) => record?._count?.patient_substance_use,
        }
      : null,
    hasAccess('patient_symptom_report', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'patient_symptom_report',
          header: 'Patient Symptom Report',
          accessorKey: 'patient_symptom_report',
          cell: ({ row: { original: record } }: any) => record?._count?.patient_symptom_report,
        }
      : null,

    !hideActions
      ? {
          id: 'actions',
          header: '',
          accessorKey: 'actions',
          cell: ({ row: { original: record } }: any) => (
            <Flex justifyContent="flex-end">
              <NextLink href={`/patients/view/${record.id}`} passHref legacyBehavior>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  mr={2}
                  padding="0rem 8px"
                  height="24px"
                  fontSize="0.75rem"
                  variant="solid"
                  backgroundColor="state.neutral.transparent"
                  color="state.neutral.main"
                  borderRadius="6px"
                >
                  View
                </Button>
              </NextLink>
              {hasAccess('patient', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                <NextLink href={`/patients/edit/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('patient', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(record.id);
                  }}
                  padding="0rem 0.5rem"
                  variant="outline"
                  aria-label="edit"
                  height={'24px'}
                  fontSize="0.75rem"
                  color="state.error.main"
                  borderRadius="6px"
                  borderColor="state.error.transparent"
                  icon={<FiTrash width="12px" height="12px" color="error.main" />}
                />
              )}
            </Flex>
          ),
        }
      : null,
  ].filter(Boolean) as ColumnType[];
  const table = (
    <Table
      hidePagination={hidePagination}
      hideTableBorders={hideTableBorders}
      isLoading={isLoading}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      columns={columns}
      data={data?.data}
      totalCount={data?.totalCount || 0}
      pageSize={params.pageSize}
      pageIndex={params.pageNumber}
      order={params.order}
      setParams={setParams}
      onRowClick={handleView}
    />
  );
  if (tableOnly) {
    return table;
  }

  return (
    <Flex direction="column" gap={{ md: 6, base: 7 }} shadow="none">
      <Flex justifyContent={{ md: 'space-between' }} direction={{ base: 'column', md: 'row' }} gap={{ base: '28px' }}>
        <Flex alignItems="center" gap={1}>
          <Text as="h1" fontSize="1.875rem" fontWeight="bold" color="base.content" {...titleProps}>
            Patients
          </Text>
          <AccessInfo entity="patient" />
        </Flex>

        {hasAccess('patient', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/patients/create`} passHref legacyBehavior>
            <Button
              onClick={(e) => e.stopPropagation()}
              height={'2rem'}
              padding="0rem 0.75rem"
              fontSize={'0.875rem'}
              fontWeight={600}
              bg="state.info.main"
              borderRadius={'6px'}
              color="base.100"
              _hover={{
                bg: 'state.info.focus',
              }}
              as="a"
            >
              <FiPlus size={16} color="state.info.content" style={{ marginRight: '0.25rem' }} />
              Create
            </Button>
          </NextLink>
        )}
      </Flex>
      {showSearchFilter && (
        <Flex
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'flex-start', md: 'space-between' }}
          gap={{ base: 2, md: 0 }}
        >
          <Box>
            <SearchInput value={params.searchTerm} onChange={onSearchTermChange} />
          </Box>
        </Flex>
      )}

      {error && (
        <Box>
          <Error error={error} />
        </Box>
      )}
      {deleteError && (
        <Box>
          <Error error={deleteError} />{' '}
        </Box>
      )}
      {table}
    </Flex>
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
  withAppLayout(),
)(PatientListPage);
