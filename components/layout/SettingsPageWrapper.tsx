import { ErroredAPIResponse } from 'nextkit';
import React from 'react';

import { useUser } from '../../hooks/queries/useUser';
import { UnauthorizedPage } from '../error/UnauthorizedPage';
import { ViewErrorPage } from '../error/ViewErrorPage';

type SettingsPageWrapperProps = {
	isLoading?: boolean;
	errors?: Array<ErroredAPIResponse | null>;
};

export const SettingsPageWrapper: React.FC<SettingsPageWrapperProps> = (props) => {
	const { children, isLoading, errors } = props;
	const { user, isUserLoading } = useUser();

	const isLoadingMerged = isUserLoading || isLoading;

	if (errors && errors.some((error) => error !== null)) {
		return <ViewErrorPage errors={errors} admin />;
	}

	if (!isLoadingMerged && !user?.id) {
		return <UnauthorizedPage />;
	}

	return <>{children}</>;
};
