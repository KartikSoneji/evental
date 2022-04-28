import { capitalizeFirstLetter } from '../../utils/string';
import Image from 'next/image';
import React from 'react';
import { Loading } from '../Loading';
import { ViewServerError } from '../ViewServerError';
import { NotFound } from '../NotFound';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import { UseOrganizerQueryData } from '../../hooks/queries/useOrganizerQuery';
import { FlexRowBetween } from '../layout/FlexRowBetween';

type Props = { eid: string; aid: string } & UseAttendeeQueryData & UseOrganizerQueryData;

export const ViewAttendee: React.FC<Props> = (props) => {
	const {
		eid,
		aid,
		attendee,
		isAttendeeLoading,
		attendeeError,
		isOrganizerLoading,
		isOrganizer,
		isOrganizerError
	} = props;

	if (isAttendeeLoading || isOrganizerLoading) {
		return <Loading />;
	}

	if (attendeeError || isOrganizerError) {
		return <ViewServerError errors={[attendeeError, isOrganizerError]} />;
	}

	if (!attendee || !attendee.user || !attendee.role) {
		return <NotFound />;
	}

	return (
		<div>
			<div>
				<div className="h-32 w-32 relative">
					<Image
						alt={String(attendee.name)}
						src={String(attendee.user.image)}
						className="rounded-full"
						layout="fill"
					/>
				</div>

				<FlexRowBetween>
					<h1 className="text-3xl">{attendee.name}</h1>

					{!isOrganizerLoading && isOrganizer && (
						<div>
							<Link href={`/events/${eid}/admin/attendees/${aid}/edit`} passHref>
								<LinkButton className="mr-3">Edit Attendee</LinkButton>
							</Link>

							<Link href={`/events/${eid}/admin/attendees/${aid}/delete`} passHref>
								<LinkButton className="mr-3">Delete Attendee</LinkButton>
							</Link>
						</div>
					)}
				</FlexRowBetween>

				<p>{capitalizeFirstLetter(String(attendee.permissionRole).toLowerCase())}</p>
				<p>{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}</p>
				<span className="text-md text-gray-700 block">{attendee.company}</span>
				<span className="text-md text-gray-700 block">{attendee.position}</span>
			</div>
		</div>
	);
};