import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { LinkButton } from '../../../../components/form/LinkButton';
import { Navigation } from '../../../../components/navigation';
import { VenueList } from '../../../../components/venues/VenueList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import { ViewServerError } from '../../../../components/ViewServerError';
import React from 'react';
import { useVenuesQuery } from '../../../../hooks/queries/useVenuesQuery';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import PageWrapper from '../../../../components/layout/PageWrapper';

const ActivitiesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));

	if (isOrganizerError) {
		return (
			<PageWrapper variant="gray">
				<ViewServerError errors={[isOrganizerError]} />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>All Venues</title>
			</Head>

			<Navigation />

			<Column>
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
		</PageWrapper>
	);
};

export default ActivitiesPage;
