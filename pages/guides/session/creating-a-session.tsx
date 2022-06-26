import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../../../components/Footer';
import { AspectImage } from '../../../components/guides/AspectImage';
import { GuideSection } from '../../../components/guides/GuideSection';
import { GuideSectionHeader } from '../../../components/guides/GuideSectionHeader';
import { StillNeedHelp } from '../../../components/guides/StillNeedHelp';
import { TableOfContents } from '../../../components/guides/TableOfContents';
import Column from '../../../components/layout/Column';
import PageWrapper from '../../../components/layout/PageWrapper';
import { Navigation } from '../../../components/navigation';
import { Heading } from '../../../components/typography/Heading';

const CreatingASessionGuidePage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Creating a session — Evental"
				description={`Learn how to create a session for your event on Evental.`}
				openGraph={{
					url: 'https://evental.app/guides/session/creating-a-session',
					title: 'Creating a session — Evental',
					description: `Learn how to create a session for your event on Evental.`,
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

			<div className="dark-topography text-white">
				<Column className="flex flex-col items-center">
					<Heading>Creating a session</Heading>
					<p className="mt-4 text-base text-gray-100">
						Learn how to create a session for your event on Evental.
					</p>
				</Column>
			</div>

			<Column>
				<TableOfContents
					items={[
						{
							text: 'Navigate to the events dashboard',
							relativeLink: '/guides/session/creating-a-session#navigate-to-the-dashboard'
						},
						{
							text: 'Navigate to the session dashboard',
							relativeLink: '/guides/session/creating-a-session#navigate-to-the-session-dashboard'
						},
						{
							text: 'Create a session',
							relativeLink: '/guides/session/creating-a-session#create-a-session'
						}
					]}
				/>

				<GuideSection id="navigate-to-the-dashboard">
					<GuideSectionHeader
						text="Navigate to the events dashboard"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/creating-a-session#navigate-to-the-dashboard`}
					/>

					<p className="mb-4 text-gray-700">
						To create a session, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id="navigate-to-the-session-dashboard">
					<GuideSectionHeader
						text="Navigate to the session dashboard"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/creating-a-session#navigate-to-the-session-dashboard`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Sessions"</span> page.
					</p>

					<AspectImage
						ratio={1615 / 622}
						imageUrl={'https://cdn.evental.app/images/session-dashboard.png'}
						alt={'Session dashboard'}
					/>
				</GuideSection>

				<GuideSection id="create-a-session">
					<GuideSectionHeader
						text="Create a session"
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/creating-a-session#create-a-session`}
					/>

					<p className="mb-4 text-gray-700">
						After visiting the session dashboard page, click the{' '}
						<span className="font-medium">"Create Session"</span> button. This will navigate you to
						the create session page, where you can create venues, categories/types, attach speakers,
						create a session description including links, images, etc.
					</p>

					<AspectImage
						ratio={1600 / 617}
						imageUrl={'https://cdn.evental.app/images/create-a-session.png'}
						alt={'Create a session'}
					/>

					<p className="my-4 text-gray-700">
						Now that you are on the create a session form, fill out the form and click the{' '}
						<span className="font-medium">"Create Session"</span> button.
					</p>

					<AspectImage
						ratio={1598 / 904}
						imageUrl={'https://cdn.evental.app/images/create-session-form.png'}
						alt={'Create a session form'}
					/>
				</GuideSection>

				<GuideSection>
					<StillNeedHelp />
				</GuideSection>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default CreatingASessionGuidePage;
