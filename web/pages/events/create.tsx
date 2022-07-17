import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { UnauthorizedPage } from '../../components/error/UnauthorizedPage';
import { CreateEventForm } from '../../components/events/CreateEventForm';
import Column from '../../components/layout/Column';
import { Footer } from '../../components/layout/Footer';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';
import { Heading } from '../../components/primitives/Heading';
import { Paragraph } from '../../components/primitives/Paragraph';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import { useUser } from '../../hooks/queries/useUser';

const CreateEventPage: NextPage = () => {
	const { createEventMutation } = useCreateEventMutation();
	const { user } = useUser();

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	const Seo = (
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
	);

	return (
		<>
			{Seo}

			<Navigation />

			<PageWrapper>
				<Column>
					<Heading className="mb-3">Create an event</Heading>

					<Paragraph className="max-w-3xl text-gray-600">
						Fill out the form below to create an event. You can edit these details later. Once you
						have created your event you can access billing, create roles, manage attendees, and
						more.
					</Paragraph>

					<CreateEventForm createEventMutation={createEventMutation} canCancel />
				</Column>
			</PageWrapper>

			<Footer />
		</>
	);
};

export default CreateEventPage;