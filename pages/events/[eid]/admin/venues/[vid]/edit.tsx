import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditVenueForm } from '../../../../../../components/venues/EditVenueForm';
import { useEditVenueMutation } from '../../../../../../hooks/mutations/useEditVenueMutation';
import { useVenueQuery } from '../../../../../../hooks/queries/useVenueQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';

const EditVenuePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, vid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { editVenueMutation, editVenueError } = useEditVenueMutation(String(eid), String(vid));
	const { venue, venueError, isVenueLoading } = useVenueQuery(String(eid), String(vid));

	if (!session.data?.user?.id) {
		return (
			<PageWrapper variant="gray">
				<Unauthorized />
			</PageWrapper>
		);
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return (
			<PageWrapper variant="gray">
				<NoAccess />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Edit Venue</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Edit Venue Page</h1>

				<EditVenueForm
					venue={venue}
					venueError={venueError}
					editVenueMutation={editVenueMutation}
					editVenueError={editVenueError}
					isVenueLoading={isVenueLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default EditVenuePage;
