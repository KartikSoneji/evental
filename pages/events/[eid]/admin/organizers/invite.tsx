import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../components/Footer';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { InviteOrganizerForm } from '../../../../../components/organizer/InviteOrganizerForm';
import { Heading } from '../../../../../components/typography/Heading';
import { useInviteOrganizerMutation } from '../../../../../hooks/mutations/useInviteOrganizerMutation';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useOrganizersQuery } from '../../../../../hooks/queries/useOrganizersQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const EventOrganizersPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { user, isUserLoading } = useUser();
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));
	const { isOrganizersLoading, organizers } = useOrganizersQuery(String(eid));
	const { inviteOrganizerMutation } = useInviteOrganizerMutation(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (eventError) {
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
		<PageWrapper>
			<Head>
				<title>Invite Organizer</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column variant="halfWidth">
				<FlexRowBetween>
					<Heading>Invite Organizer</Heading>
				</FlexRowBetween>
				<p className="mb-2 text-base text-gray-700">
					Organizers are able to create, edit, and delete sessions, venues, and roles.
				</p>

				{/*TODO: Skeletonize*/}
				{event && (
					<InviteOrganizerForm event={event} inviteOrganizerMutation={inviteOrganizerMutation} />
				)}
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default EventOrganizersPage;
