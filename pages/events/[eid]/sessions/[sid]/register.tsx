import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import { PrivatePage } from '../../../../../components/error/PrivatePage';
import { UnauthorizedPage } from '../../../../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../../../../components/error/ViewErrorPage';
import { EventNavigation } from '../../../../../components/events/Navigation';
import Column from '../../../../../components/layout/Column';
import { Footer } from '../../../../../components/layout/Footer';
import PageWrapper from '../../../../../components/layout/PageWrapper';
import { Heading } from '../../../../../components/primitives/Heading';
import { CreateSessionAttendeeForm } from '../../../../../components/sessions/CreateSessionAttendeeForm';
import { useEventQuery } from '../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../hooks/queries/useIsOrganizerQuery';
import { useSessionQuery } from '../../../../../hooks/queries/useSessionQuery';
import { useUser } from '../../../../../hooks/queries/useUser';

const SessionRegisterPage: NextPage = () => {
	const router = useRouter();
	const { eid, sid } = router.query;
	const { session } = useSessionQuery(String(eid), String(sid));
	const { user } = useUser();
	const { event, eventError } = useEventQuery(String(eid));
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (event && event.privacy === 'PRIVATE' && !isOrganizer && !isOrganizerLoading) {
		return <PrivatePage />;
	}

	const Seo = session && event && (
		<NextSeo
			title={`Register for ${session.name} — ${event.name}`}
			description={`Register for the ${session.name} session at ${event.name}`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
			openGraph={{
				url: `https://evental.app/events/${event.slug}/sessions/${session.slug}/register`,
				title: `Register for ${session.name} — ${event.name}`,
				description: `Register for the ${session.name} session at ${event.name}`,
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
				<Column variant="halfWidth" className="space-y-5">
					<Heading>
						{session ? `Register for ${session.name}` : <Skeleton className={'w-full max-w-xl'} />}
					</Heading>

					<p className="text-gray-700">
						To attend this session, please click the register button below.
					</p>

					<CreateSessionAttendeeForm eid={String(eid)} sid={String(sid)} />
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default SessionRegisterPage;
