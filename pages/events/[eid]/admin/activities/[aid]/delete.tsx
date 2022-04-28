import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Column from '../../../../../../components/layout/Column';
import { DeleteActivityForm } from '../../../../../../components/activities/DeleteActivityForm';
import { Navigation } from '../../../../../../components/navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import React from 'react';
import PageWrapper from '../../../../../../components/layout/PageWrapper';

const DeleteActivityPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, aid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	if (!session.data?.user?.id) {
		return (
			<PageWrapper variant="gray">
				<Unauthorized />
			</PageWrapper>
		);
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return (
			<PageWrapper variant="gray">
				<NoAccess />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Head>
				<title>Delete Activity</title>
			</Head>

			<Navigation />

			<Column>
				<h1 className="text-3xl">Delete Activity Page</h1>

				<DeleteActivityForm eid={String(eid)} aid={String(aid)} />
			</Column>
		</PageWrapper>
	);
};

export default DeleteActivityPage;
