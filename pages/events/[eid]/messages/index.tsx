import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { PrivatePage } from '../../../../components/error/PrivatePage';
import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import { EventHeader } from '../../../../components/events/EventHeader';
import { EventNavigation } from '../../../../components/events/Navigation';
import Column from '../../../../components/layout/Column';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { MessageList } from '../../../../components/messages/MessageList';
import { Heading } from '../../../../components/primitives/Heading';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../hooks/queries/useIsOrganizerQuery';
import { useMessages } from '../../../../hooks/queries/useMessages';

const MessagesPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;
	const { messages } = useMessages(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { event, eventError } = useEventQuery(String(eid));

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	return (
		<PageWrapper>
			{event && (
				<NextSeo
					title={`Messages — ${event.name}`}
					description={`View all of the messages at ${event.name}.`}
					additionalLinkTags={[
						{
							rel: 'icon',
							href: `https://cdn.evental.app${event.image}`
						}
					]}
					openGraph={{
						url: `https://evental.app/events/${event.slug}/messages`,
						title: `Messages — ${event.name}`,
						description: `View all of the messages at ${event.name}.`,
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
			)}

			<EventNavigation eid={String(eid)} />

			<Column>
				<EventHeader adminLink={'/messages'} eid={String(eid)} />

				<Heading variant="xl" level={2} className="mb-3">
					{event && messages ? 'Messages' : <Skeleton className="w-48" />}
				</Heading>

				{messages && <MessageList eid={String(eid)} messages={messages} />}
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default MessagesPage;