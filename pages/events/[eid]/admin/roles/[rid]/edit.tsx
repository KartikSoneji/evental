import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { BackButton } from '../../../../../../components/BackButton';
import Column from '../../../../../../components/Column';
import { Navigation } from '../../../../../../components/Navigation';
import NoAccess from '../../../../../../components/NoAccess';
import Unauthorized from '../../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../../hooks/queries/useOrganizerQuery';
import { EditRoleForm } from '../../../../../../components/Roles/EditRoleForm';
import { useRoleAttendeesQuery } from '../../../../../../hooks/queries/useRoleAttendeesQuery';
import { useEditRoleMutation } from '../../../../../../hooks/mutations/useEditRoleMutation';

const EditRolePage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid, rid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { roleAttendeesError, role, isRoleAttendeesLoading, attendees } = useRoleAttendeesQuery(
		String(eid),
		String(rid)
	);
	const { editRoleError, editRoleMutation } = useEditRoleMutation(String(eid), String(rid));

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Edit Rid</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Edit Role Page</h1>

				<EditRoleForm
					eid={String(eid)}
					rid={String(rid)}
					role={role}
					editRoleError={editRoleError}
					roleAttendeesError={roleAttendeesError}
					editRoleMutation={editRoleMutation}
					isRoleAttendeesLoading={isRoleAttendeesLoading}
					attendees={attendees}
				/>
			</Column>
		</>
	);
};

export default EditRolePage;