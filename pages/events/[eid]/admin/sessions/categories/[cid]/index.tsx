import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { ViewSessionCategory } from '../../../../../../../components/categories/ViewSessionCategory';
import { AdminPageWrapper } from '../../../../../../../components/layout/AdminPageWrapper';
import Column from '../../../../../../../components/layout/Column';
import PageWrapper from '../../../../../../../components/layout/PageWrapper';
import { SidebarWrapper } from '../../../../../../../components/layout/SidebarWrapper';
import { useEventQuery } from '../../../../../../../hooks/queries/useEventQuery';
import { useSessionCategoryQuery } from '../../../../../../../hooks/queries/useSessionCategoryQuery';
import { useSessionsByCategoryQuery } from '../../../../../../../hooks/queries/useSessionsByCategoryQuery';
import { useUser } from '../../../../../../../hooks/queries/useUser';

const ViewSessionCategoryPage: NextPage = () => {
	const router = useRouter();
	const { cid, eid } = router.query;
	const { user, isUserLoading } = useUser();
	const { event, eventError, isEventLoading } = useEventQuery(String(eid));
	const { sessionCategory, sessionCategoryError, isSessionCategoryLoading } =
		useSessionCategoryQuery(String(eid), String(cid));
	const { sessionsByCategoryData, isSessionsByCategoryLoading } = useSessionsByCategoryQuery(
		String(eid),
		String(cid)
	);

	return (
		<AdminPageWrapper
			errors={[eventError, sessionCategoryError]}
			isLoading={
				isUserLoading || isEventLoading || isSessionCategoryLoading || isSessionsByCategoryLoading
			}
			eid={String(eid)}
		>
			<PageWrapper>
				<Head>
					<title>Viewing Session</title>
				</Head>

				<SidebarWrapper eid={String(eid)}>
					<Column variant="noMargin">
						<ViewSessionCategory
							sessionCategory={sessionCategory}
							eid={String(eid)}
							cid={String(cid)}
							sessions={sessionsByCategoryData}
							event={event}
							user={user}
							admin
						/>
					</Column>
				</SidebarWrapper>
			</PageWrapper>
		</AdminPageWrapper>
	);
};

export default ViewSessionCategoryPage;
