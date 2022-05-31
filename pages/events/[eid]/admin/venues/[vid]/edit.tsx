import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../../components/Footer';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { EditVenueForm } from '../../../../../../components/venues/EditVenueForm';
import { useEditVenueMutation } from '../../../../../../hooks/mutations/useEditVenueMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';

const EditVenuePage: NextPage = () => {
	const router = useRouter();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venue, venueError, isVenueLoading } = useVenueQuery(String(eid), String(vid));
	const { editVenueMutation } = useEditVenueMutation(String(eid), String(vid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (isVenueLoading || isUserLoading || isOrganizerLoading || isEventLoading || isRolesLoading) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!venue) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (venueError) {
		return <ViewErrorPage errors={[venueError]} />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Venue</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column>
				<h3 className="text-xl md:text-2xl font-medium">Edit Venue</h3>

				<EditVenueForm
					eid={String(eid)}
					venue={venue}
					venueError={venueError}
					editVenueMutation={editVenueMutation}
					isVenueLoading={isVenueLoading}
				/>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default EditVenuePage;
