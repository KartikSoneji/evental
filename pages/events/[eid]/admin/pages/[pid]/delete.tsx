import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Footer } from '../../../../../../components/Footer';
import { NoAccessPage } from '../../../../../../components/error/NoAccessPage';
import { NotFoundPage } from '../../../../../../components/error/NotFoundPage';
import { UnauthorizedPage } from '../../../../../../components/error/UnauthorizedPage';
import { EventSettingsNavigation } from '../../../../../../components/events/settingsNavigation';
import Column from '../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../components/layout/PageWrapper';
import { DeletePageForm } from '../../../../../../components/pages/DeletePageForm';
import { Heading } from '../../../../../../components/typography/Heading';
import { useDeletePageMutation } from '../../../../../../hooks/mutations/useDeletePageMutation';
import { useEventQuery } from '../../../../../../hooks/queries/useEventQuery';
import { useIsOrganizerQuery } from '../../../../../../hooks/queries/useIsOrganizerQuery';
import { usePageQuery } from '../../../../../../hooks/queries/usePageQuery';
import { useRolesQuery } from '../../../../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../../../../hooks/queries/useUser';

const DeletePagePage: NextPage = () => {
	const router = useRouter();
	const { eid, pid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useIsOrganizerQuery(String(eid));
	const { page, isPageLoading, pageError } = usePageQuery(String(eid), String(pid));
	const { deletePageMutation } = useDeletePageMutation(String(eid), String(pid));
	const { user, isUserLoading } = useUser();
	const { event, eventError } = useEventQuery(String(eid));
	const { roles, isRolesLoading } = useRolesQuery(String(eid));

	if (!user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isOrganizer) {
		return <NoAccessPage />;
	}

	if (pageError) {
		return <NotFoundPage message="Page not found" />;
	}

	if (eventError) {
		return <NotFoundPage message="Event not found." />;
	}

	return (
		<PageWrapper>
			<Head>
				<title>Delete Page</title>
			</Head>

			<EventSettingsNavigation eid={String(eid)} />

			<Column variant="halfWidth">
				{page && (
					<p className="mb-4 block rounded-md bg-red-500 py-3 px-5 font-medium text-white">
						You are about to delete an page ("{page.name}")
					</p>
				)}

				<Heading>Delete Page</Heading>

				<DeletePageForm
					page={page}
					isPageLoading={isPageLoading}
					pageError={pageError}
					deletePageMutation={deletePageMutation}
				/>
			</Column>

			<Footer color={event?.color} />
		</PageWrapper>
	);
};

export default DeletePagePage;
