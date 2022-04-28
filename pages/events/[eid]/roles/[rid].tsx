import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import React from 'react';
import { RoleAttendeeList } from '../../../../components/roles/RoleAttendeeList';
import { useRoleAttendeesQuery } from '../../../../hooks/queries/useRoleAttendeesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { rid, eid } = router.query;
	const { attendees, role, isRoleAttendeesLoading, roleAttendeesError } = useRoleAttendeesQuery(
		String(eid),
		String(rid)
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Role: {rid}</title>
			</Head>

			<Navigation />

			<Column>
				<RoleAttendeeList
					eid={String(eid)}
					rid={String(rid)}
					role={role}
					attendees={attendees}
					roleAttendeesError={roleAttendeesError}
					isOrganizer={isOrganizer}
					isOrganizerError={isOrganizerError}
					isOrganizerLoading={isOrganizerLoading}
					isRoleAttendeesLoading={isRoleAttendeesLoading}
				/>
			</Column>
		</PageWrapper>
	);
};

export default ViewAttendeePage;
