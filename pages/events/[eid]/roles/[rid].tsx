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
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';

type Props = {
	initialRole: Prisma.EventRole | undefined;
	initialAttendees: AttendeeWithUser[] | undefined;
	initialOrganizer: boolean;
	initialUser: PasswordlessUser | undefined;
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
		return <ViewErrorPage errors={[isOrganizerError, roleAttendeesError]} />;
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

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialRole = (await getRole(String(eid), String(rid))) ?? undefined;
	const initialAttendees = (await getAttendeesByRole(String(eid), String(rid))) ?? undefined;
	const initialOrganizer = (await getIsOrganizer(initialUser?.id, String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialRole,
			initialAttendees,
			initialOrganizer
		}
	};
};

export default ViewAttendeePage;
