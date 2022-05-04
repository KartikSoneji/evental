import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { LinkButton } from '../../../../../components/form/LinkButton';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useUser } from '../../../../../hooks/queries/useUser';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import { RoleList } from '../../../../../components/roles/RoleList';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';

const RolesAdminPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));

	if (isEventLoading || isUserLoading || isOrganizerLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Roles</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<div>
					<FlexRowBetween>
						<span className="text-2xl md:text-3xl font-bold">Roles</span>

						<div>
							<Link href={`/events/${eid}/admin/roles/create`} passHref>
								<LinkButton padding="medium">Create</LinkButton>
							</Link>
						</div>
					</FlexRowBetween>

					<RoleList
						admin
						eid={String(eid)}
						roles={roles}
						isRolesLoading={isRolesLoading}
						rolesError={rolesError}
					/>
				</div>
			</Column>
		</PageWrapper>
	);
};

export default RolesAdminPage;
