import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
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
import { Session } from 'next-auth';
import { getVenue } from '../../../../../api/events/[eid]/venues/[vid]';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { LoadingPage } from '../../../../../../components/error/LoadingPage';
import { ViewServerErrorPage } from '../../../../../../components/error/ViewServerErrorPage';

type Props = {
	initialOrganizer: boolean;
	initialVenue: Prisma.EventVenue | undefined;
	session: Session | null;
};

const DeleteVenuePage: NextPage<Props> = (props) => {
	const { initialOrganizer, initialVenue, session } = props;
	const router = useRouter();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid), initialOrganizer);
	const { venue, venueError, isVenueLoading } = useVenueQuery(
		String(eid),
		String(vid),
		initialVenue
	);
	const { deleteVenueMutation } = useDeleteVenueMutation(String(eid), String(vid));

	if (!session?.user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccessPage />;
	}

	if (!initialVenue) {
		return <NotFoundPage />;
	}

	if (isVenueLoading) {
		return <LoadingPage />;
	}

	if (venueError) {
		return <ViewServerErrorPage errors={[venueError]} />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Venue</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Delete Venue Page</h1>

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

	const session = await getSession(context);
	const initialOrganizer = (await getIsOrganizer(session?.user.id, String(eid))) ?? undefined;
	const initialVenue = (await getVenue(String(eid), String(vid))) ?? undefined;

	return {
		props: {
			session,
			initialOrganizer,
			initialVenue
		}
	};
};

export default DeleteVenuePage;
