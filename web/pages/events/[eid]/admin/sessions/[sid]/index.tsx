import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { AdminPageWrapper } from '../../../../../../components/layout/AdminPageWrapper';
import { AdminSidebarWrapper } from '../../../../../../components/layout/AdminSidebarWrapper';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { ViewSession } from '../../../../../../components/sessions/ViewSession';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useSessionAttendeeQuery } from '../../../../../../hooks/queries/useSessionAttendeeQuery';
import { useSessionAttendeesQuery } from '../../../../../../hooks/queries/useSessionAttendeesQuery';
import { useSessionQuery } from '../../../../../../hooks/queries/useSessionQuery';
import { useSessionRoleAttendeesQuery } from '../../../../../../hooks/queries/useSessionRoleAttendeesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const ViewSessionPage: NextPage = () => {
	const router = useRouter();
	const { sid, eid } = router.query;
	const { user } = useUser();
	const { session, isSessionLoading, sessionError } = useSessionQuery(String(eid), String(sid));
	const { sessionAttendeeQuery } = useSessionAttendeeQuery(
		String(eid),
		String(sid),
		String(user?.id)
	);
	const { sessionAttendeesQuery } = useSessionAttendeesQuery(String(eid), String(sid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { sessionRoleAttendeesQuery } = useSessionRoleAttendeesQuery(String(eid), String(sid));

	return (
		<AdminPageWrapper
			errors={[eventError, sessionError]}
			isLoading={
				isSessionLoading ||
				isEventLoading ||
				sessionRoleAttendeesQuery.isLoading ||
				sessionAttendeesQuery.isLoading ||
				sessionAttendeeQuery.isLoading
			}
			eid={String(eid)}
		>
			<PageWrapper>
				<Head>
					<title>Viewing Session</title>
				</Head>

				<AdminSidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewSession
							admin
							user={user}
							roleAttendees={sessionRoleAttendeesQuery.data}
							attendees={sessionAttendeesQuery.data}
							isAttending={Boolean(sessionAttendeeQuery.data)}
							session={session}
							eid={String(eid)}
							sid={String(sid)}
							event={event}
						/>
					</Column>
				</AdminSidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewSessionPage;