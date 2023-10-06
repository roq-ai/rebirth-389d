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

import { getHpcMeetingEvaluationsById } from 'apiSdk/hpc-meeting-evaluations';
import { HpcMeetingEvaluationsInterface } from 'interfaces/hpc-meeting-evaluations';

function HpcMeetingEvaluationsViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<HpcMeetingEvaluationsInterface>(
    () => (id ? `/hpc-meeting-evaluations/${id}` : null),
    () =>
      getHpcMeetingEvaluationsById(id, {
        relations: ['hpc_meetings'],
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
              label: 'Hpc Meeting Evaluations',
              link: '/hpc-meeting-evaluations',
            },
            {
              label: 'Hpc Meeting Evaluations Details',
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
                    Hpc Meeting Evaluations Details
                  </Text>
                </Box>
                {hasAccess('hpc_meeting_evaluations', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                  <NextLink href={`/hpc-meeting-evaluations/edit/${id}`} passHref legacyBehavior>
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

                <FormListItem label="Treatment Information" text={data?.treatment_information} />

                <FormListItem label="Issues Since Last Review" text={data?.issues_since_last_review} />

                <FormListItem label="Extra Support Needed" text={data?.extra_support_needed} />

                <FormListItem label="Treatment Plan Changed" text={data?.treatment_plan_changed} />

                <FormListItem label="Treatment Plan Changed How" text={data?.treatment_plan_changed_how} />

                <FormListItem label="Treatment Plan Changed Other" text={data?.treatment_plan_changed_other} />

                <FormListItem label="Treatmen Plan Changed Why" text={data?.treatmen_plan_changed_why} />

                <FormListItem label="How Successfull" text={data?.how_successfull} />

                <FormListItem label="Any Further Recommandations" text={data?.any_further_recommandations} />

                {hasAccess('hpc_meetings', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Hpc Meetings"
                    text={
                      <Link as={NextLink} href={`/hpc-meetings/view/${data?.hpc_meetings?.id}`}>
                        {data?.hpc_meetings?.snapshot_id}
                      </Link>
                    }
                  />
                )}
              </List>
            </FormWrapper>
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
    entity: 'hpc_meeting_evaluations',
    operation: AccessOperationEnum.READ,
  }),
)(HpcMeetingEvaluationsViewPage);
