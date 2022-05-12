import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewAttendee } from '../../../../components/attendees/ViewAttendee';
import Column from '../../../../components/layout/Column';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { NotFoundPage } from '../../../../components/error/NotFoundPage';
import React from 'react';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { LoadingPage } from '../../../../components/error/LoadingPage';
import { ssrGetUser } from '../../../../utils/api';
import { AttendeeWithUser, PasswordlessUser } from '../../../../utils/stripUserPassword';
import { getAttendee } from '../../../api/events/[eid]/attendees/[uid]';
import { EventNavigation } from '../../../../components/events/navigation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import Prisma from '@prisma/client';
import { getEvent } from '../../../api/events/[eid]';
import { getRoles } from '../../../api/events/[eid]/roles';
import { usePagesQuery } from '../../../../hooks/queries/usePagesQuery';
import { getPages } from '../../../api/events/[eid]/pages';

type Props = {
	initialAttendee: AttendeeWithUser | undefined;
	initialUser: PasswordlessUser | undefined;
	initialEvent: Prisma.Event | undefined;
	initialRoles: Prisma.EventRole[] | undefined;
	initialPages: Prisma.EventPage[] | undefined;
};

const ViewAttendeePage: NextPage<Props> = (props) => {
	const { initialAttendee, initialRoles, initialUser, initialEvent, initialPages } = props;
	const router = useRouter();
	const { uid, eid } = router.query;
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(
		String(eid),
		String(uid),
		initialAttendee
	);
	const { event, isEventLoading, eventError } = useEventQuery(String(eid), initialEvent);
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid), initialRoles);
	const { user } = useUser(initialUser);
	const { pages, isPagesLoading } = usePagesQuery(String(eid), {
		initialData: initialPages
	});
	if (isAttendeeLoading || isEventLoading || isRolesLoading || isPagesLoading) {
		return <LoadingPage />;
	}

	if (attendeeError || eventError || rolesError) {
		return <ViewErrorPage errors={[attendeeError, eventError, rolesError]} />;
	}

	if (!attendee || !attendee.user || !attendee.role) {
		return <NotFoundPage />;
	}

	if (!event) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Viewing Attendee</title>
			</Head>

			<EventNavigation event={event} roles={roles} user={user} pages={pages} />

			<Column>
				<ViewAttendee attendee={attendee} eid={String(eid)} uid={String(uid)} />
			</Column>
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const { uid, eid } = context.query;

	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialAttendee = (await getAttendee(String(eid), String(uid))) ?? undefined;
	const initialEvent = (await getEvent(String(eid))) ?? undefined;
	const initialRoles = (await getRoles(String(eid))) ?? undefined;
	const initialPages = (await getPages(String(eid))) ?? undefined;

	return {
		props: {
			initialUser,
			initialAttendee,
			initialEvent,
			initialRoles,
			initialPages
		}
	};
};

export default ViewAttendeePage;
