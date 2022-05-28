import Prisma from '@prisma/client';
import classNames from 'classnames';
import { formatInTimeZone } from 'date-fns-tz';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { NotFound } from '../error/NotFound';
import Tooltip from '../radix/components/Tooltip';

type Props = { events: Prisma.Event[]; className?: string };

export const EventList: React.FC<Props> = (props) => {
	const { events, className } = props;

	if (events && events.length === 0) {
		return <NotFound message="No events found." />;
	}

	return (
		<div className={classNames(className)}>
			{events &&
				events.map((event, i) => (
					<div
						key={event.id}
						className={classNames(
							'hover:bg-gray-75 border-gray-100',
							i + 1 !== events.length ? 'border-b-2' : null
						)}
					>
						<Link href={`/events/${event.slug}`}>
							<a className="py-3 block">
								<div className="flex flex-row items-center">
									<div className="flex flex-col align-center justify-center w-12 md:ml-5">
										<Tooltip
											side={'top'}
											message={`This is event is taking place from ${formatInTimeZone(
												new Date(event.startDate),
												Intl.DateTimeFormat().resolvedOptions().timeZone,
												'MMMM do'
											)} to ${formatInTimeZone(
												new Date(event.endDate),
												Intl.DateTimeFormat().resolvedOptions().timeZone,
												'MMMM do  zzz'
											)}.`}
										>
											<span className="text-gray-600 text-center block text-tiny">
												{formatInTimeZone(
													new Date(event.startDate),
													Intl.DateTimeFormat().resolvedOptions().timeZone,
													'MMM dd'
												)}
												<br />
												{formatInTimeZone(
													new Date(event.endDate),
													Intl.DateTimeFormat().resolvedOptions().timeZone,
													'MMM dd'
												)}
											</span>
										</Tooltip>
									</div>

									<div className="relative min-w-[3em] min-h-[3em] md:w-16 md:h-16 rounded-md mx-3 md:mx-5 border-2 border-gray-100">
										<Image
											alt={event.name}
											src={
												event.image
													? `https://cdn.evental.app${event.image}`
													: `https://cdn.evental.app/images/default-event.jpg`
											}
											layout="fill"
											className="rounded-md"
										/>
									</div>

									<div className="flex flex-col items-start">
										<Tooltip
											side={'top'}
											message={`This is a ${event?.category?.toLowerCase()} event.`}
										>
											<span className="text-gray-500 text-tiny font-medium inline-block flex-shrink">
												{event.category}
											</span>
										</Tooltip>

										<span className="text-lg md:text-xl font-medium block">{event.name}</span>
									</div>
								</div>
							</a>
						</Link>
					</div>
				))}
		</div>
	);
};
