import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../components/layout/Column';
import { Navigation } from '../../../../components/navigation';
import React from 'react';
import { RoleAttendeeList } from '../../../../components/roles/RoleAttendeeList';
import { useRoleAttendeesQuery } from '../../../../hooks/queries/useRoleAttendeesQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { getIsOrganizer } from '../../../api/events/[eid]/organizer';
import Prisma from '@prisma/client';
import { getAttendeesByRole, getRole } from '../../../api/events/[eid]/roles/[rid]';
import { EventAttendeeUser } from '../../../api/events/[eid]/attendees/[aid]';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewNextkitErrorPage } from '../../../../components/error/ViewNextkitErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { PasswordlessUser } from '../../../../utils/api';

type Props = {
	initialRole: Prisma.EventRole | undefined;
	initialAttendees: EventAttendeeUser[] | undefined;
	initialOrganizer: boolean;
	user: PasswordlessUser | null;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const { initialAttendees, initialOrganizer, initialRole } = props;
	const router = useRouter();
	const { rid, eid } = router.query;
	const { attendees, role, isRoleAttendeesLoading, roleAttendeesError } = useRoleAttendeesQuery(
		String(eid),
		String(rid),
		{ attendees: initialAttendees, role: initialRole }
	);
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(
		String(eid),
		initialOrganizer
	);

	if (!initialAttendees || !initialRole || !role || !attendees) {
		return <NotFoundPage message="Role not found." />;
	}

	if (isOrganizerLoading || isRoleAttendeesLoading) {
		return <LoadingPage />;
	}

	if (isOrganizerError || roleAttendeesError) {
		return <ViewNextkitErrorPage errors={[isOrganizerError, roleAttendeesError]} />;
	}

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

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { eid, rid } = context.query;

	const session = await getSession(context);
	const initialRole = (await getRole(String(eid), String(rid))) ?? undefined;
	const initialAttendees = (await getAttendeesByRole(String(eid), String(rid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(user.id, String(eid))) ?? undefined;

	return {
		props: {
			session,
			initialRole,
			initialAttendees,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
