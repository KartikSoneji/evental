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

const sections: Section[] = [
	{ anchor: 'navigate-to-the-dashboard', title: 'Navigate to the dashboard' },
	{ anchor: 'navigate-to-the-roles-page', title: 'Navigate to the roles page' },
	{ anchor: 'select-a-role', title: 'Select a role' },
	{ anchor: 'create-a-member', title: 'Create a role member' }
];

const CreatingRoleMemberGuidePage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Creating a role member — Evental"
				description={`Learn how to create a role member to your event on Evental.`}
				openGraph={{
					url: 'https://evental.app/guides/role/creating-a-role-member',
					title: 'Creating a role member — Evental',
					description: `Learn how to create a role member to your event on Evental.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Creating a role member</h1>
					<p className="text-gray-100 text-md mt-4">
						Learn how to create a role member to your event on Evental.
					</p>
				</Column>
			</div>

			<Column>
				<TableOfContents
					items={[
						{
							text: sections[0].title,
							relativeLink: `/guides/role/creating-a-role-member#${sections[0].anchor}`
						},
						{
							text: sections[1].title,
							relativeLink: `/guides/role/creating-a-role-member#${sections[1].anchor}`
						},
						{
							text: sections[2].title,
							relativeLink: `/guides/role/creating-a-role-member#${sections[2].anchor}`
						},
						{
							text: sections[3].title,
							relativeLink: `/guides/role/creating-a-role-member#${sections[3].anchor}`
						}
					]}
				/>

				<GuideSection id={sections[0].anchor}>
					<GuideSectionHeader
						text={sections[0].title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/role/creating-a-role-member#${sections[0].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						To create a role member, navigate to the events admin dashboard by clicking the{' '}
						<span className="font-medium">"manage this event"</span> button.
					</p>

					<AspectImage
						ratio={1603 / 798}
						imageUrl={'https://cdn.evental.app/images/manage-this-event.png'}
						alt={'Manage this event'}
					/>
				</GuideSection>

				<GuideSection id={sections[1].anchor}>
					<GuideSectionHeader
						text={sections[1].title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/role/creating-a-role-member#${sections[1].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the events dashboard, click the{' '}
						<span className="font-medium">"Roles"</span> link in the top navigation.
					</p>
				</GuideSection>

				<GuideSection id={sections[2].anchor}>
					<GuideSectionHeader
						text={sections[2].title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/role/creating-a-role-member#${sections[2].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						After visiting the roles dashboard page, select the role you wish to create members to.
					</p>
				</GuideSection>
				<GuideSection id={sections[3].anchor}>
					<GuideSectionHeader
						text={sections[3].title}
						url={`${
							process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
						}/guides/role/creating-a-role-member#${sections[3].anchor}`}
					/>

					<p className="text-gray-700 mb-4">
						Select the <span className="font-medium">"Create"</span> button, then enter the users
						basic information, picture, and email then hit "Create". After creating a role member,
						this user will receive an email with instructions on how to claim their Evental account.
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

export default CreatingRoleMemberGuidePage;