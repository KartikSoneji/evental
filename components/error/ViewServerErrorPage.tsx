import { ServerErrorPayload } from '../../typings/error';
import React from 'react';
import PageWrapper from '../layout/PageWrapper';
import Head from 'next/head';
import { Navigation } from '../navigation';
import Column from '../layout/Column';

type Props = {
	errors: Array<ServerErrorPayload | null>;
};

export const ViewServerErrorPage: React.FC<Props> = (props) => {
	const { errors } = props;

	if (!errors) {
		return null;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Not Found</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl font-bold mb-2">Error</h1>
				<ul>
					{errors
						.filter((error) => error)
						.map((error, i) => (
							<li key={i} className="text-red-700">
								{error!.message}
							</li>
						))}
				</ul>
			</Column>
		</PageWrapper>
	);
};
