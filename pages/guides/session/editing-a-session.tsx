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

type Section = {
	anchor: string;
	title: string;
};

const sections: Record<string, Section> = {
	navigateDashboard: { anchor: 'navigate-to-the-dashboard', title: 'Navigate to the dashboard' },
	navigateSessions: {
		anchor: 'navigate-to-the-sessions-page',
		title: 'Navigate to the sessions page'
	},
	editSession: { anchor: 'edit-a-session', title: 'Edit a session' }
};

const EditingASessionGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Editing a session — Evental"
				description={`Learn how to edit a session for your event on Evental.`}
				openGraph={{
					url: 'https://evental.app/guides/session/editing-a-session',
					title: 'Editing a session — Evental',
					description: `Learn how to edit a session for your event on Evental.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Editing a session</h1>
					<p className="text-gray-100 text-md mt-4">
						Learn how to edit a session for your event on Evental.
					</p>
				</Column>
			</div>

			<Column>
				<TableOfContents
					items={[
						{
							text: sections.navigateDashboard.title,
							relativeLink: `/guides/session/editing-a-session#${sections.navigateDashboard.anchor}`
						},
						{
							text: sections.navigateSessions.title,
							relativeLink: `/guides/session/editing-a-session#${sections.navigateSessions.anchor}`
						},
						{
							text: sections.editSession.title,
							relativeLink: `/guides/session/editing-a-session#${sections.editSession.anchor}`
						}
					]}
				/>

				<GuideSection id={sections.navigateDashboard.anchor}>
					<GuideSectionHeader
						text={sections.navigateDashboard.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/editing-a-session#${sections.navigateDashboard.anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						To edit a session, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id={sections.navigateSessions.anchor}>
					<GuideSectionHeader
						text={sections.navigateSessions.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/editing-a-session#${sections.navigateSessions.anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Sessions"</span> link in the top navigation.
					</p>
				</GuideSection>

				<GuideSection id={sections.editSession.anchor}>
					<GuideSectionHeader
						text={sections.editSession.title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/session/editing-a-session#${sections.editSession.anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the sessions dashboard page, select the session you wish to edit by
						clicking the session.
					</p>
					<p className="text-gray-700 mb-4">
						After selecting a session, select the <span className="font-medium">"Edit"</span>{' '}
						button.
					</p>

					<p className="text-gray-700 mb-4">
						After selecting the "Edit" button. You will be navigated to the edit session form. Fill
						out the edit session form to edit a session.
					</p>
				</GuideSection>

				<GuideSection>
					<StillNeedHelp />
				</GuideSection>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default EditingASessionGuidePage;