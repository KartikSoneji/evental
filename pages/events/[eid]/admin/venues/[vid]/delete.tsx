import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { DeleteVenueForm } from '../../../../../../components/venues/DeleteVenueForm';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';
import { useDeleteVenueMutation } from '../../../../../../hooks/mutations/useDeleteVenueMutatation';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';
import { getVenue } from '../../../../../api/events/[eid]/venues/[vid]';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewErrorPage } from '../../../../../../components/error/ViewErrorPage';
import { ssrGetUser } from '../../../../../../utils/api';
import { useUser } from '../../../../../../hooks/queries/useUser';
import { PasswordlessUser } from '../../../../../../utils/stripUserPassword';

type Props = {
	initialOrganizer: boolean;
	initialVenue: Prisma.EventVenue | undefined;
	initialUser: PasswordlessUser | undefined;
};

const DeleteVenuePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenue, initialUser } = props;
	const router = useRouter();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venue, venueError, isVenueLoading } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { deleteVenueMutation } = useDeleteVenueMutation(String(eid), String(vid));
	const { user } = useUser(initialUser);

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialVenue || !venue) {
		return <NotFoundPage message="Venue not found." />;
	}

	if (isVenueLoading) {
		return <LoadingPage />;
	}

	if (venueError) {
		return <ViewErrorPage errors={[venueError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Venue</title>
			</Head>

			<Navigation />

			<Column variant="halfWidth">
				<p className="block text-white bg-red-500 px-5 py-3 rounded-md mb-4 font-semibold">
					You are about to delete a venue ("{venue.name}")
				</p>

				<h1 className="text-3xl font-bold">Delete Venue</h1>

				<DeleteVenueForm
					venue={venue}
					venueError={venueError}
					deleteVenueMutation={deleteVenueMutation}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, vid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialOrganizer,
			initialVenue
		}
	};
};

export default DeleteVenuePage;
