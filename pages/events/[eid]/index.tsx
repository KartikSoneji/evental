import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../components/Column';
import { ViewEvent } from '../../../components/events/ViewEvent';
import { Navigation } from '../../../components/navigation';
import { useActivitiesQuery } from '../../../hooks/queries/useActivitiesQuery';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useOrganizerQuery } from '../../../hooks/queries/useOrganizerQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';

const ViewEventPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));
	const { event, isEventLoading, eventError } = useEventQuery(String(eid));
	const { activities, isActivitiesLoading, activitiesError } = useActivitiesQuery(String(eid));
	const { roles, isRolesLoading, rolesError } = useRolesQuery(String(eid));

	return (
		<div>
			<Head>
				<title>{event && event.name}</title>
			</Head>

			<Navigation />

			<Column>
				<ViewEvent
					eid={String(eid)}
					event={event}
					eventError={eventError}
					isEventLoading={isEventLoading}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizerError={isOrganizerError}
					activities={activities}
					isActivitiesLoading={isActivitiesLoading}
					activitiesError={activitiesError}
					roles={roles}
					isRolesLoading={isRolesLoading}
					rolesError={rolesError}
				/>
			</Column>
		</div>
	);
};

export default ViewEventPage;
