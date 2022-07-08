import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { ViewErrorPage } from '../../../../components/error/ViewErrorPage';
import Column from '../../../../components/layout/Column';
import { FlexRowBetween } from '../../../../components/layout/FlexRowBetween';
import { Footer } from '../../../../components/layout/Footer';
import PageWrapper from '../../../../components/layout/PageWrapper';
import { Navigation } from '../../../../components/navigation';
import { Button } from '../../../../components/primitives/Button';
import { Heading } from '../../../../components/primitives/Heading';
import { LinkButton } from '../../../../components/primitives/LinkButton';
import { useAcceptOrganizerInviteMutation } from '../../../../hooks/mutations/useAcceptOrganizerInviteMutation';
import { useEventQuery } from '../../../../hooks/queries/useEventQuery';
import { useUser } from '../../../../hooks/queries/useUser';
import { AcceptOrganizerInviteSchema } from '../../../../utils/schemas';

const OrganizerInvitePage: NextPage = () => {
	const router = useRouter();
	const { user } = useUser();
	const { eid, code } = router.query;
	const { acceptOrganizerInviteMutation } = useAcceptOrganizerInviteMutation(String(eid));
	const { event, eventError } = useEventQuery(String(eid));

	const Seo = event && (
		<NextSeo
			title={`Accept Organizer Invite`}
			additionalLinkTags={[
				{
					rel: 'icon',
					href: `https://cdn.evental.app${event.image}`
				}
			]}
		/>
	);

	if (eventError) {
		return <ViewErrorPage errors={[eventError]} />;
	}

	if (!user?.id) {
		let params = new URLSearchParams();

		params.append('redirectUrl', String(router.asPath));

		return (
			<>
				{Seo}
				<Navigation />
				<PageWrapper>
					<Column variant="halfWidth">
						<div className="space-y-5">
							<Heading>Create an account</Heading>
							<p className="text-gray-700">
								To organize this event, please{' '}
								<Link href={`/auth/signup?${params}`}>
									<a className="text-gray-900 underline">create an account</a>
								</Link>{' '}
								or{' '}
								<Link href={`/auth/signin?${params}`}>
									<a className="text-gray-900 underline">sign in</a>
								</Link>{' '}
								with your existing account.
							</p>
							<div className="flex flex-row justify-end">
								<Button type="button" variant="no-bg" className="mr-3" onClick={router.back}>
									Cancel
								</Button>

								<Link href={`/auth/signin?${params}`} passHref>
									<LinkButton padding="large" variant="primary">
										Sign in
									</LinkButton>
								</Link>
							</div>
						</div>
					</Column>
				</PageWrapper>

				<Footer color={event?.color} />
			</>
		);
	}

	return (
		<>
			{Seo}

			<Navigation />

			<PageWrapper>
				<Column variant="halfWidth">
					<FlexRowBetween>
						<Heading>Accept Organizer Invite</Heading>
					</FlexRowBetween>

					<p className="mb-2 text-base text-gray-700">
						As an organizer you will be able to create, edit, and delete sessions, venues, and
						roles.
					</p>

					<div className="flex flex-row justify-end">
						<Button type="button" variant="no-bg" onClick={router.back}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={() => {
								const data = AcceptOrganizerInviteSchema.parse({ code: String(code) });

								acceptOrganizerInviteMutation.mutate(data);
							}}
						>
							Accept Invite
						</Button>
					</div>
				</Column>
			</PageWrapper>

			<Footer color={event?.color} />
		</>
	);
};

export default OrganizerInvitePage;
