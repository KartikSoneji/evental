import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import { useAttendeesQuery } from '../../../../hooks/queries/useAttendeesQuery';
import { AttendeeList } from '../../../../components/attendees/AttendeeList';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../components/layout/PageWrapper';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { attendees, attendeesError, isAttendeesLoading } = useAttendeesQuery(String(eid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Attendee: {aid}</title>
			</Head>

			<Navigation />

			<Column>
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-3xl">Attendees</h1>
				</div>

				<AttendeeList
					isOrganizerError={isOrganizerError}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizer={isOrganizer}
					attendees={attendees}
					attendeesError={attendeesError}
					isAttendeesLoading={isAttendeesLoading}
					eid={String(eid)}
				/>
			</Column>
		</PageWrapper>
	);
};

export default ViewAttendeePage;
