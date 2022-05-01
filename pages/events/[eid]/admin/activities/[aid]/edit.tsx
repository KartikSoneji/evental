import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { EditActivityForm } from '../../../../../../components/activities/EditActivityForm';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';

import { useVenuesQuery } from '../../../../../../hooks/queries/useVenuesQuery';
import { useActivityQuery } from '../../../../../../hooks/queries/useActivityQuery';
import { useEditActivityMutation } from '../../../../../../hooks/mutations/useEditActivityMutation';
import { getActivity } from '../../../../../api/events/[eid]/activities/[aid]';
import { getVenues } from '../../../../../api/events/[eid]/venues';
import type Prisma from '@prisma/client';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import Link from 'next/link';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { PasswordlessUser, ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';

type Props = {
	initialOrganizer: boolean;
	initialActivity: Prisma.EventActivity | undefined;
	initialVenues: Prisma.EventVenue[];
	initialUser: PasswordlessUser | undefined;
};

const EditActivityPage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialUser, initialVenues, initialActivity } = props;
	const router = useRouter();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { activity, isActivityLoading, activityError } = useActivityQuery(
		String(eid),
		String(aid),
		initialActivity
	);
	const { editActivityMutation } = useEditActivityMutation(String(eid), String(aid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialActivity || !activity) {
		return <NotFoundPage message="Activity not found" />;
	}

	if (!initialVenues || !venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (isVenuesLoading || isEventLoading) {
		return <LoadingPage />;
	}

	if (venuesError || eventError) {
		return <ViewErrorPage errors={[venuesError, eventError]} />;
	}

	if (venues && venues.length === 0) {
		return (
			<PageWrapper>
				<Link href={`/events/${eid}/admin/venues/edit`}>
					<a className="text-red-600">Before creating an activity, you must create a venue.</a>
				</Link>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Activity</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold">Edit Activity</h1>

				<EditActivityForm
					eid={String(eid)}
					aid={String(aid)}
					venues={venues}
					activity={activity}
					editActivityMutation={editActivityMutation}
					isActivityLoading={isActivityLoading}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
					activityError={activityError}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, aid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialActivity = (await getActivity(String(eid), String(aid))) ?? undefined;
	const initialVenues = (await getVenues(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialActivity,
			initialVenues
		}
	};
};

export default EditActivityPage;
