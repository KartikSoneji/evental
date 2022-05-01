import { NextPage } from 'next';
import React from 'react';
import Column from '../../../components/layout/Column';
import { Navigation } from '../../../components/navigation';
import PageWrapper from '../../../components/layout/PageWrapper';
import { useUser } from '../../../hooks/queries/useUser';
import { LoadingPage } from '../../../components/error/LoadingPage';
import { RequestPasswordResetForm } from '../../../components/password/RequestPasswordResetForm';
import { useRequestPasswordReset } from '../../../hooks/mutations/useRequestPasswordReset';

const RequestPasswordResetPage: NextPage = () => {
	const { user, isUserLoading } = useUser();
	const { requestPasswordResetMutation } = useRequestPasswordReset();

	if (isUserLoading) {
		return <LoadingPage />;
	}

	if (user) {
		return (
			<PageWrapper variant="gray">
				<Navigation />

				<Column variant="halfWidth">
					<div className="flex flex-row justify-between mb-3">
						<h1 className="text-3xl font-bold">Sign in</h1>
					</div>

					<p>You are already signed in.</p>
				</Column>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper variant="gray">
			<Navigation />

			<Column variant="halfWidth">
				<div className="flex flex-row justify-between mb-3">
					<h1 className="text-3xl font-bold">Request Password Reset</h1>
				</div>

				<RequestPasswordResetForm requestPasswordResetMutation={requestPasswordResetMutation} />
			</Column>
		</PageWrapper>
	);
};

export default RequestPasswordResetPage;
