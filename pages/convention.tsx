import type { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';

import { Footer } from '../components/Footer';
import Column from '../components/layout/Column';
import PageWrapper from '../components/layout/PageWrapper';
import { Navigation } from '../components/navigation';
import { Heading } from '../components/typography/Heading';

const PricingPage: NextPage = () => {
	return (
		<PageWrapper>
			<NextSeo
				title="Convention — Evental"
				description={`See why Evental is perfect for your next convention event.`}
				openGraph={{
					url: 'https://evental.app/pricing',
					title: 'Convention — Evental',
					description: `See why Evental is perfect for your next convention event.`,
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

			<Column className="flex flex-col items-center">
				<Heading>Convention Events with Evental</Heading>
				<p className="mt-4 text-base text-gray-600">
					See why Evental is perfect for your next convention event.
				</p>
			</Column>

			<Footer />
		</PageWrapper>
	);
};

export default PricingPage;
