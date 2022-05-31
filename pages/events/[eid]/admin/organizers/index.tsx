import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../components/Footer';
import { AttendeeList } from '../../../../../components/attendees/AttendeeList';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import { LinkButton } from '../../../../../components/form/LinkButton';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useOrganizersQuery } from '../../../../../hooks/queries/useOrganizersQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const EventOrganizersPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { isOrganizersLoading, organizers } = useOrganizersQuery(String(eid));

	if (
		isEventLoading ||
		isUserLoading ||
		isOrganizerLoading ||
		isRolesLoading ||
		isOrganizersLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	if (!organizers) {
		return <NotFoundPage message="Organizers not found." />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Organizers</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<FlexRowBetween>
					<h3 className="text-xl md:text-2xl font-medium">Organizers</h3>
					<Link href={`/events/${eid}/admin/organizers/invite`}>
						<LinkButton>Invite Organizer</LinkButton>
					</Link>
				</FlexRowBetween>

				<AttendeeList attendees={organizers} eid={String(eid)} admin />
			</Column>
			<Footer />
		</PageWrapper>
	);
};

export default EventOrganizersPage;
