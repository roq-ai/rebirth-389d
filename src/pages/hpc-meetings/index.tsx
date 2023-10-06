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
import { getHpcMeetings, deleteHpcMeetingsById } from 'apiSdk/hpc-meetings';
import { HpcMeetingsInterface } from 'interfaces/hpc-meetings';

type ColumnType = ColumnDef<HpcMeetingsInterface, unknown>;

interface HpcMeetingsListPageProps {
  filters?: ListDataFiltersType;
  pageSize?: number;
  hidePagination?: boolean;
  showSearchFilter?: boolean;
  titleProps?: TextProps;
  hideTableBorders?: boolean;
  tableOnly?: boolean;
  hideActions?: boolean;
}

export function HpcMeetingsListPage(props: HpcMeetingsListPageProps) {
  const {
    filters = {},
    titleProps = {},
    showSearchFilter = false,
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
      getHpcMeetings({
        relations: [
          'patient',
          'hpc_decision_makings.count',
          'hpc_meeting_evaluations.count',
          'hpc_meeting_members.count',
        ],
        limit: params.pageSize,
        offset: params.pageNumber * params.pageSize,
        searchTerm: params.searchTerm,
        order: params.order,
        searchTermKeys: [],
        ...(params.filters || {}),
      }),
    [params.pageSize, params.pageNumber, params.searchTerm, params.order, params.filters],
  );

  const { data, error, isLoading, mutate } = useSWR<PaginatedInterface<HpcMeetingsInterface>>(
    () => `/hpc-meetings?params=${JSON.stringify(params)}`,
    fetcher,
  );

  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteHpcMeetingsById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (row: HpcMeetingsInterface) => {
    if (hasAccess('hpc_meetings', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/hpc-meetings/view/${row.id}`);
    }
  };

  const columns: ColumnType[] = [
    { id: 'status', header: 'status', accessorKey: 'status' },
    { id: 'meeting_type', header: 'meeting_type', accessorKey: 'meeting_type' },
    {
      id: 'date',
      header: 'Date',
      accessorKey: 'date',
      cell: ({ row: { original: record } }: any) =>
        record?.date ? format(parseISO(record?.date as unknown as string), 'dd-MM-yyyy') : '',
    },
    { id: 'current_step', header: 'current_step', accessorKey: 'current_step' },
    { id: 'number', header: 'number', accessorKey: 'number' },
    { id: 'snapshot_id', header: 'Snapshot Id', accessorKey: 'snapshot_id' },
    hasAccess('patient', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'patient',
          header: 'Patient',
          accessorKey: 'patient',
          cell: ({ row: { original: record } }: any) => (
            <Link as={NextLink} onClick={(e) => e.stopPropagation()} href={`/patients/view/${record.patient?.id}`}>
              {record.patient?.email}
            </Link>
          ),
        }
      : null,
    hasAccess('hpc_decision_makings', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'hpc_decision_makings',
          header: 'Hpc Decision Makings',
          accessorKey: 'hpc_decision_makings',
          cell: ({ row: { original: record } }: any) => record?._count?.hpc_decision_makings,
        }
      : null,
    hasAccess('hpc_meeting_evaluations', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'hpc_meeting_evaluations',
          header: 'Hpc Meeting Evaluations',
          accessorKey: 'hpc_meeting_evaluations',
          cell: ({ row: { original: record } }: any) => record?._count?.hpc_meeting_evaluations,
        }
      : null,
    hasAccess('hpc_meeting_members', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)
      ? {
          id: 'hpc_meeting_members',
          header: 'Hpc Meeting Members',
          accessorKey: 'hpc_meeting_members',
          cell: ({ row: { original: record } }: any) => record?._count?.hpc_meeting_members,
        }
      : null,

    !hideActions
      ? {
          id: 'actions',
          header: '',
          accessorKey: 'actions',
          cell: ({ row: { original: record } }: any) => (
            <Flex justifyContent="flex-end">
              <NextLink href={`/hpc-meetings/view/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('hpc_meetings', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                <NextLink href={`/hpc-meetings/edit/${record.id}`} passHref legacyBehavior>
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
              {hasAccess('hpc_meetings', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
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
            Hpc Meetings
          </Text>
          <AccessInfo entity="hpc_meetings" />
        </Flex>

        {hasAccess('hpc_meetings', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <NextLink href={`/hpc-meetings/create`} passHref legacyBehavior>
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
    entity: 'hpc_meetings',
    operation: AccessOperationEnum.READ,
  }),
  withAppLayout(),
)(HpcMeetingsListPage);
