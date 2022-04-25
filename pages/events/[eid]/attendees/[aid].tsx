import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ViewAttendee } from '../../../../components/Attendees/ViewAttendee';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useAttendeeQuery } from '../../../../hooks/queries/useAttendeeQuery';
import { useOrganizerQuery } from '../../../../hooks/queries/useOrganizerQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { aid, eid } = router.query;
	const { attendee, isAttendeeLoading, attendeeError } = useAttendeeQuery(String(eid), String(aid));
	const { isOrganizer, isOrganizerLoading, isOrganizerError } = useOrganizerQuery(String(eid));

	return (
		<div>
			<Head>
				<title>Viewing Attendee: {aid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<ViewAttendee
					attendee={attendee}
					attendeeError={attendeeError}
					isAttendeeLoading={isAttendeeLoading}
					isOrganizer={isOrganizer}
					isOrganizerLoading={isOrganizerLoading}
					isOrganizerError={isOrganizerError}
					eid={String(eid)}
					aid={String(aid)}
				/>
			</Column>
		</div>
	);
};

export default ViewAttendeePage;
