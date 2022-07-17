import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';

import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { SessionList } from '../../../../components/sessions/SessionList';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionsQuery } from '../../../../hooks/queries/useSessionsQuery';

const SessionsPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { sessionsData } = useSessionsQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = event && (
		<NextSeo
			title={`Sessions — ${event.name}`}
			description={`View all of the sessions for ${event.name}.`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/sessions`,
				title: `Sessions — ${event.name}`,
				description: `View all of the sessions for ${event.name}.`,
				images: [
					{
						url: `https://cdn.evental.app${event.image}`,
						width: 300,
						height: 300,
						alt: `${event.name} Logo Alt`,
						type: 'image/jpeg'
					}
				]
			}}
		/>
	);

	return (
		<>
			{Seo}

			<EventNavigation eid={String(eid)} />

			<PageWrapper>
				<Column>
					<EventHeader adminLink={'/sessions'} eid={String(eid)} />

					<SessionList sessions={sessionsData} event={event} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default SessionsPage;