import type Prisma from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../../utils/ServerError';

export type EventAttendeeUser = Prisma.EventAttendee & {
	user: {
		name: string | null;
		image: string | null;
	};
	role: {
		name: string | null;
	};
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventAttendee>
) => {
	const { eid, uid } = req.query;

	try {
		const event = await prisma.event.findFirst({
			where: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			}
		});

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const eventAttendee = await prisma.eventAttendee.findFirst({
			where: {
				userId: String(uid),
				eventId: event.id
			},
			include: {
				user: {
					select: {
						name: true,
						image: true
					}
				},
				role: {
					select: {
						name: true
					}
				}
			}
		});

		if (!eventAttendee) {
			return res.status(200).end();
		}

		return res.status(200).send(eventAttendee);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
