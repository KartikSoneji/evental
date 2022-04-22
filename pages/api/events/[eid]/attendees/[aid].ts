import type Prisma from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export type EventMemberUser = Prisma.EventMember & {
	user: {
		name: string | null;
		image: string | null;
		company: string | null;
		position: string | null;
	};
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, aid } = req.query;

	try {
		let attendee = await prisma.eventMember.findFirst({
			where: {
				OR: [{ userId: String(aid) }, { slug: String(aid) }],
				event: {
					OR: [{ id: String(eid) }, { slug: String(eid) }]
				}
			},
			include: {
				user: {
					select: {
						name: true,
						image: true,
						company: true,
						position: true
					}
				}
			}
		});

		return res.status(200).send(attendee || {});
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
