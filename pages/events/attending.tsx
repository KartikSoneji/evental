import type Prisma from '@prisma/client';
import type { GetServerSideProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../../components/Footer';
import { LoadingPage } from '../../components/error/LoadingPage';
import { NotFoundPage } from '../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { ViewErrorPage } from '../../components/error/ViewErrorPage';
import { EventList } from '../../components/events/EventList';
import { EventsPageNavigation } from '../../components/events/EventsPageNavigation';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/typography/Heading';
import { useAttendingEventsQuery } from '../../hooks/queries/useAttendingEventsQuery';
import { useUser } from '../../hooks/queries/useUser';
import { ssrGetUser } from '../../utils/api';
import { PasswordlessUser } from '../../utils/stripUserPassword';
import { getAttendingEvents } from '../api/events/attending';

type Props = {
	initialUser: PasswordlessUser | undefined;
	initialAttendingEvents: Prisma.Event[];
};

const AttendingEventsPage: NextPage<Props> = (props) => {
	const { initialAttendingEvents, initialUser } = props;
	const { attendingEventsError, isAttendingEventsLoading, attendingEvents } =
		useAttendingEventsQuery(String(initialUser?.id), initialAttendingEvents);
	const { user } = useUser(initialUser);

	if (isAttendingEventsLoading) {
		return <LoadingPage />;
	}

	if (attendingEventsError) {
		return <ViewErrorPage errors={[attendingEventsError]} />;
	}

	if (!user) {
		return <UnauthorizedPage />;
	}

	if (!attendingEvents) {
		return <NotFoundPage message="You are not attending any events" />;
	}

	if (attendingEvents.length === 0) {
		return (
			<PageWrapper>
				<NextSeo
					title="Attending Events — Evental"
					description="View all of the events you are attending."
					openGraph={{
						url: 'https://evental.app/events/attending',
						title: 'Attending Events',
						description: 'View all of the events you are attending.',
						images: [
							{
								url: 'https://cdn.evental.app/images/logo.jpg',
								width: 389,
								height: 389,
								alt: 'Evental Logo Alt',
								type: 'image/jpeg'
							}
						]
					}}
				/>

				<Navigation />

				<Column>
					<Heading>Attending Events</Heading>

					{user && <EventsPageNavigation />}

					<span className="mt-5 block text-center text-base">
						You are not attending any events.{' '}
						<Link href="/events" passHref>
							<a className="mt-3 font-medium text-primary">Find Events</a>
						</Link>
					</span>
				</Column>

				<Footer />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<NextSeo
				title="Attending Events — Evental"
				description="View all of the events you are attending."
				openGraph={{
					url: 'https://evental.app/events/attending',
					title: 'Attending Events',
					description: 'View all of the events you are attending.',
					images: [
						{
							url: 'https://cdn.evental.app/images/logo.jpg',
							width: 389,
							height: 389,
							alt: 'Evental Logo Alt',
							type: 'image/jpeg'
						}
					]
				}}
			/>

			<Navigation />

			<Column>
				<h1 className="mb-3 text-center text-2xl font-bold md:text-3xl">Attending Events</h1>

				<EventsPageNavigation />

				<EventList events={attendingEvents} />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	const initialUser = (await ssrGetUser(context.req)) ?? undefined;
	const initialAttendingEvents = await getAttendingEvents(String(initialUser?.id));

	return {
		props: { initialAttendingEvents, initialUser }
	};
};

export default AttendingEventsPage;
