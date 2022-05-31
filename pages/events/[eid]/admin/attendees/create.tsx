import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import { Footer } from '../../../../../components/Footer';
import { AdminCreateAttendeeForm } from '../../../../../components/attendees/AdminCreateAttendeeForm';
import { LoadingPage } from '../../../../../components/error/LoadingPage';
import { NoAccessPage } from '../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../components/events/settingsNavigation';
import Column from '../../../../../components/layout/Column';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { useAdminCreateAttendeeMutation } from '../../../../../hooks/mutations/useAdminCreateAttendeeMutation';
import { useAttendeesQuery } from '../../../../../hooks/queries/useAttendeesQuery';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const CreateAttendeePage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { adminCreateAttendeeMutation } = useAdminCreateAttendeeMutation(String(eid));
	const { user, isUserLoading } = useUser();
	const { event, isEventLoading } = useEventQuery(String(eid));
	const { attendeesData, isAttendeesLoading } = useAttendeesQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (
		isOrganizerLoading ||
		isUserLoading ||
		isEventLoading ||
		isAttendeesLoading ||
		isRolesLoading
	) {
		return <LoadingPage />;
	}

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (!event || !attendeesData) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Create Attendee</title>
			</Head>

			<EventSettingsNavigation event={event} roles={roles} user={user} />

			<Column variant="halfWidth">
				<h3 className="text-xl md:text-2xl font-medium mb-2">Create Attendee Page</h3>

				<p className="mb-5 text-gray-600">
					Filling out the information below will create an placeholder account for this user. They
					will receive an email with instructions on how to claim their account.
				</p>

				<AdminCreateAttendeeForm
					eid={String(eid)}
					roles={roles}
					adminCreateAttendeeMutation={adminCreateAttendeeMutation}
				/>
			</Column>
			<Footer />
		</PageWrapper>
	);
};

export default CreateAttendeePage;
