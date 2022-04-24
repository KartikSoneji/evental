import Link from 'next/link';
import { capitalizeFirstLetter } from '../../utils/string';
import React from 'react';
import { LinkButton } from '../Form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { AttendeeList } from '../Attendees/AttendeeList';
import { UseRoleAttendeesQueryData } from '../../hooks/queries/useRoleAttendeesQuery';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';
import { ServerError } from '../ServerError';

type Props = {
	eid: string;
	rid: string;
} & UseRoleAttendeesQueryData &
	UseOrganizerQueryData;

export const RoleAttendeeList: React.FC<Props> = (props) => {
	const {
		eid,
		rid,
		isRoleAttendeesLoading,
		role,
		roleAttendeesError,
		isOrganizerLoading,
		isOrganizerError,
		isOrganizer,
		attendees
	} = props;

	if (isOrganizerLoading || isRoleAttendeesLoading) {
		return <Loading />;
	}

	if (isOrganizerError || roleAttendeesError) {
		return <ServerError errors={[isOrganizerError, roleAttendeesError]} />;
	}

	if (!role || !attendees) {
		return <NotFound />;
	}

	if (attendees?.length === 0) {
		return (
			<div>
				{role && (
					<>
						<div className="flex flex-row justify-between">
							<h2 className="text-2xl mb-3">
								{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
							</h2>
							{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
								<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
									<LinkButton className="mr-3">Edit role</LinkButton>
								</Link>
							)}
						</div>

						<p>No {role.name.toLowerCase()}s found.</p>
					</>
				)}
			</div>
		);
	}

	return (
		<div>
			{attendees && role && (
				<div>
					<div className="flex flex-row justify-between">
						<h2 className="text-2xl my-3">
							{capitalizeFirstLetter(role.name.toLowerCase())}s ({attendees.length})
						</h2>
						{!isOrganizerError && !isOrganizerLoading && isOrganizer && (
							<Link href={`/events/${eid}/admin/roles/${rid}/edit`} passHref>
								<LinkButton className="mr-3">Edit role</LinkButton>
							</Link>
						)}
					</div>

					<AttendeeList
						attendees={attendees}
						attendeesError={roleAttendeesError}
						isAttendeesLoading={isRoleAttendeesLoading}
						eid={eid}
					/>
				</div>
			)}
		</div>
	);
};