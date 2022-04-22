import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { Navigation } from '../../../../components/Navigation';
import { useVenueQuery } from '../../../../hooks/useVenueQuery';

const ViewAttendeePage: NextPage = () => {
	const router = useRouter();
	const { vid, eid } = router.query;
	const { venue, isVenueLoading } = useVenueQuery(String(eid), String(vid));

	return (
		<>
			<Head>
				<title>Viewing Venue: {vid}</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				{isVenueLoading ? (
					<p>Loading Venue...</p>
				) : (
					venue && (
						<div>
							<h1 className="text-3xl">{venue.name}</h1>
							<p>{venue.description}</p>
						</div>
					)
				)}
			</Column>
		</>
	);
};

export default ViewAttendeePage;