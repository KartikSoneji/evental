import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../../components/Footer';
import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/typography/Heading';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import { useUser } from '../../hooks/queries/useUser';

const CreateEventPage: NextPage = () => {
	const { createEventMutation } = useCreateEventMutation();
	const { user } = useUser();

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	return (
		<PageWrapper>
			<NextSeo
				title="Create an event — Evental"
				description="Fill out the form to create an event."
				openGraph={{
					url: 'https://evental.app/events/create',
					title: 'Create an event',
					description: 'Fill out the form to create an event.',
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
				<Heading>Create an event</Heading>

				<p className="mt-2">
					Create and setup a private event, invite organizers, customize your event, create
					sessions, attendees, pages, and more.
				</p>

				<CreateEventForm createEventMutation={createEventMutation} canCancel />
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default CreateEventPage;
