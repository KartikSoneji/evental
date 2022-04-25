import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { LinkButton } from '../../../../components/Form/LinkButton';
import { Navigation } from '../../../../components/Navigation';
import { VenueList } from '../../../../components/Venues/VenueList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { ServerError } from '../../../../components/ServerError';
import React from 'react';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { FlexRowBetween } from '../../../../components/FlexRowBetween';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));

	if (isOrganizerError) {
		return (
			<div>
				<ServerError errors={[isOrganizerError]} />
			</div>
		);
	}

	return (
		<div>
			<Head>
				<title>All Venues</title>
			</Head>

			<Navigation />

			<Column>
				<BackButton />

				<FlexRowBetween>
					<h1 className="text-3xl">Venues Page</h1>

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
		</div>
	);
};

export default ActivitiesPage;
