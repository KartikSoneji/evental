import {
	faAddressBook,
	faAddressCard,
	faArrowUpRightFromSquare,
	faBuilding,
	faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import parse from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { capitalizeFirstLetter } from '../../utils/string';
import { AttendeeWithUser } from '../../utils/stripUserPassword';
import { LinkButton } from '../form/LinkButton';
import { FlexRowBetween } from '../layout/FlexRowBetween';
import Tooltip from '../radix/components/Tooltip';

type Props = { eid: string; uid: string; admin?: boolean; attendee: AttendeeWithUser };

export const ViewAttendee: React.FC<Props> = (props) => {
	const { eid, uid, attendee, admin = false } = props;

	if (!attendee) return null;

	return (
		<div>
			<FlexRowBetween variant="start">
				<div className="h-32 w-32 relative">
					<Image
						alt={String(attendee.user.name)}
						src={String(
							attendee?.user.image
								? `https://cdn.evental.app${attendee?.user.image}`
								: `https://cdn.evental.app/images/default-avatar.jpg`
						)}
						className="rounded-full"
						layout="fill"
					/>
				</div>

				{admin && (
					<div>
						<Link href={`/events/${eid}/admin/attendees/${uid}/edit`} passHref>
							<LinkButton className="mr-3">Edit Attendee</LinkButton>
						</Link>

						<Link href={`/events/${eid}/admin/attendees/${uid}/delete`} passHref>
							<LinkButton className="mr-3">Delete Attendee</LinkButton>
						</Link>
					</div>
				)}
			</FlexRowBetween>

			<h1 className="text-2xl md:text-3xl font-bold">{attendee.user.name}</h1>

			<div>
				{attendee.role.name && (
					<Tooltip side={'top'} message={`This user is attending as a ${attendee.role.name}`}>
						<div className="inline-flex flex-row items-center mb-1 cursor-help">
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mr-1.5"
								size="1x"
								icon={faAddressCard}
							/>
							<p>{capitalizeFirstLetter(String(attendee.role.name))}</p>
						</div>
					</Tooltip>
				)}
			</div>

			<div>
				{attendee.user.location && (
					<Tooltip side={'top'} message={`This user is located in ${attendee.user.location}`}>
						<div className="inline-flex flex-row items-center mb-1 cursor-help">
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mr-1.5"
								size="1x"
								icon={faLocationDot}
							/>
							<p>{attendee.user.location}</p>
						</div>
					</Tooltip>
				)}
			</div>

			<div>
				{attendee.user.company && (
					<Tooltip side={'top'} message={`This user works for ${attendee.user.company}`}>
						<div className="inline-flex flex-row items-center mb-1 cursor-help">
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mr-1.5"
								size="1x"
								icon={faBuilding}
							/>
							<p>{attendee.user.company}</p>
						</div>
					</Tooltip>
				)}
			</div>

			<div>
				{attendee.user.position && (
					<Tooltip
						side={'top'}
						message={
							attendee.user.company
								? `This user works for ${attendee.user.company} as a ${attendee.user.position}`
								: `This user works as a ${attendee.user.position}`
						}
					>
						<div className="inline-flex flex-row items-center mb-1  cursor-help">
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 mr-1.5"
								size="1x"
								icon={faAddressBook}
							/>
							<p>{attendee.user.position}</p>
						</div>
					</Tooltip>
				)}
			</div>

			<div>
				{attendee.user.website && (
					<Tooltip side={'top'} message={`This user's website link is ${attendee.user.website}`}>
						<a href={attendee.user.website} target="_blank" rel="noopener noreferrer">
							<div className="inline-flex flex-row items-center mb-1">
								<FontAwesomeIcon
									fill="currentColor"
									className="w-5 h-5 mr-1.5"
									size="1x"
									icon={faArrowUpRightFromSquare}
								/>
								<p>{attendee.user.website}</p>
							</div>
						</a>
					</Tooltip>
				)}
			</div>

			{attendee.user.description && (
				<div className="prose focus:outline-none prose-a:text-primary">
					{parse(String(attendee.user.description))}
				</div>
			)}
		</div>
	);
};
