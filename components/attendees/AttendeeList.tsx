import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { capitalizeFirstLetter } from '../../utils/string';
import { NotFound } from '../error/NotFound';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

type Props = {
	eid: string;
	attendees: AttendeeWithUser[];
	admin?: boolean;
};

export const AttendeeList: React.FC<Props> = (props) => {
	const { eid, attendees, admin = false } = props;

	if (attendees && attendees?.length === 0) {
		return <NotFound message="No attendees found." />;
	}

	return (
		<div>
			<ul className="flex flex-row flex-wrap flex-start items-center">
				{attendees &&
					attendees.map(
						(attendee) =>
							attendee &&
							attendee.user &&
							attendee.role && (
								<li key={attendee.id} className="w-32">
									<Link
										href={`/events/${eid}${admin ? '/admin' : ''}/attendees/${attendee.user.slug}`}
									>
										<a className="flex items-center justify-center flex-col">
											<div className="h-16 w-16 relative mb-1">
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
											<span className="font-medium text-lg">{attendee.user.name}</span>
											<span className="block text-gray-700 text-sm leading-none">
												{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}
											</span>
										</a>
									</Link>
								</li>
							)
					)}
			</ul>
		</div>
	);
};
