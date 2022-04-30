import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { LinkButton } from '../../../../components/form/LinkButton';
import { Navigation } from '../../../../components/navigation';
import { VenueList } from '../../../../components/venues/VenueList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';

import React from 'react';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../components/layout/PageWrapper';

import Prisma from '@prisma/client';

import { getVenues } from '../../../api/events/[eid]/venues';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ViewNextkitErrorPage } from '../../../../components/error/ViewNextkitErrorPage';
import user from '../../../api/auth/user';
import { PasswordlessUser } from '../../../../utils/api';

type Props = {
	initialVenues: Prisma.EventVenue[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
};

const ActivitiesPage: NextPage<Props> = (props) => {
	const router = useRouter();
	const { initialVenues, initialOrganizer } = props;
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid), initialVenues);

	if (!initialVenues || !venues) {
		return <NotFoundPage message="No venues found." />;
	}

	if (isOrganizerError || venuesError) {
		return <ViewNextkitErrorPage errors={[isOrganizerError]} />;
	}

	if (isVenuesLoading || isOrganizerLoading) {
		return <LoadingPage />;
	}

	if (!venues || !initialVenues) {
		return <NotFoundPage message="No venues found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>All Venues</title>
			</Head>

			<Navigation />

			<Column>
				<FlexRowBetween>
					<h1 className="text-3xl font-bold">Venues</h1>

					{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
						<Link href={`/events/${eid}/admin/venues/create`} passHref>
							<LinkButton>Create venue</LinkButton>
						</Link>
					)}
				</FlexRowBetween>

				<VenueList
					eid={String(eid)}
					venues={venues}
					isOrganizerError={isOrganizerError}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isVenuesLoading={isVenuesLoading}
					venuesError={venuesError}
				/>
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid } = context.query;

	const session = await getSession(context);
	const initialVenues = (await getVenues(String(eid))) ?? undefined;
	const initialOrganizer = await getIsOrganizer(user.id, String(eid));

	return {
		props: {
			session,
			initialVenues,
			initialOrganizer
		}
	};
};

export default ActivitiesPage;
