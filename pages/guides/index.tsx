import { faBars, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

import { Footer } from '../../components/Footer';
import { LinkButton } from '../../components/form/LinkButton';
import Column from '../../components/layout/Column';
import PageWrapper from '../../components/layout/PageWrapper';
import { Navigation } from '../../components/navigation';

const GuidesPage: NextPage = () => {
	return (
		<PageWrapper variant="white">
			<NextSeo
				title="Guides — Evental"
				description={`Need help getting started as an organizer or an attendee? Check out our guides.`}
				openGraph={{
					url: 'https://evental.app/guides',
					title: 'Guides — Evental',
					description: `Need help getting started as an organizer or an attendee? Check out our guides.`,
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
					<h1 className="text-2xl md:text-3xl font-bold">Support Guides</h1>
					<p className="text-gray-100 text-md mt-4">
						Need help getting started as an organizer, speaker or an attendee? Check out our guides.
					</p>
				</Column>
			</div>

			<Column>
				<h2 className="text-2xl md:text-3xl font-bold mb-3">Guides for Attendees & Speakers</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10 md:mb-16">
					<div className="border border-gray-200 p-5 rounded-md shadow-sm">
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">Attendees</span>
						<p className="text-gray-600 text-sm">
							Checkout the following guides below, if you are still in need help, reach out to us at{' '}
							<a
								href="mailto:support@evental.app"
								className="underline text-gray-900"
								target="_blank"
								rel="noopener noreferrer"
							>
								support@evental.app
							</a>{' '}
							or by fill out a{' '}
							<Link href="/support">
								<a className="underline text-gray-900">support ticket</a>
							</Link>
							.
						</p>

						<ul className="py-4 space-y-0.5">
							<li>
								<Link href="/guides/attendees/attending-an-event">
									<a className="underline">
										<FontAwesomeIcon
											className="cursor-pointer pr-2 text-primary-400"
											size="1x"
											icon={faFile}
										/>
										Attending an event
									</a>
								</Link>
							</li>
							<li>
								<Link href="/guides/attendees/attending-a-session">
									<a className="underline">
										<FontAwesomeIcon
											className="cursor-pointer pr-2 text-primary-400"
											size="1x"
											icon={faFile}
										/>
										Attending a session
									</a>
								</Link>
							</li>
							<li>
								<Link href="/guides/attendees/attending-a-session">
									<a className="underline">
										<FontAwesomeIcon
											className="cursor-pointer pr-2 text-primary-400"
											size="1x"
											icon={faFile}
										/>
										Viewing/Downloading your schedule
									</a>
								</Link>
							</li>
							<li>
								<Link href="/guides/attendees/editing-your-profile">
									<a className="underline">
										<FontAwesomeIcon
											className="cursor-pointer pr-2 text-primary-400"
											size="1x"
											icon={faFile}
										/>
										Customizing your profile
									</a>
								</Link>
							</li>
						</ul>
						<div className="flex flex-col items-end">
							<Link href="/support">
								<LinkButton>View All</LinkButton>
							</Link>
						</div>
					</div>
					<div className="border border-gray-200 p-5 rounded-md shadow-sm">
						<span className="block text-xl md:text-2xl mb-1 font-bold text-center">Speakers</span>
						<p className="text-gray-600 text-center">
							Considering using Evental? Not sure if Evental will meet your needs? Reach out to our
							team by booking a call or demo below, or email us at{' '}
							<a
								href="mailto:sales@evental.app"
								className="underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								sales@evental.app
							</a>
						</p>
						<div className="flex flex-col items-end mt-6">
							<Link href="/demo">
								<LinkButton>View All</LinkButton>
							</Link>
						</div>
					</div>
				</div>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default GuidesPage;