import Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../prisma/client';
import { api } from '../../../../utils/api';
import { SessionWithVenue } from '../../events/[eid]/sessions';
import { getUser } from './index';

export type SessionWithVenueEvent = {
	event: Prisma.Event | null;
} & SessionWithVenue;

export default api({
	async GET({ req }) {
		const { uid } = req.query;

		const sessionList = await getSessionsByUser(String(uid));

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessionsByUser = async (uid: string): Promise<SessionWithVenueEvent[] | null> => {
	const user = await getUser(uid);

	if (!user) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			attendees: {
				some: {
					attendee: {
						user: {
							id: user.id
						}
					}
				}
			}
		},
		include: {
			event: true,
			venue: true,
			type: true,
			_count: {
				select: { attendees: true }
			},
			attendees: {
				include: {
					attendee: {
						include: {
							user: {
								select: {
									id: true
								}
							}
						}
					}
				}
			}
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({ attendeeCount: session._count.attendees, ...session }));
};
