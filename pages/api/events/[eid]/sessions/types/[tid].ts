import Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';

export default api({
	async GET({ req }) {
		const { eid, tid } = req.query;

		const sessionType = await getSessionType(String(eid), String(tid));

		if (!sessionType) {
			throw new NextkitError(404, 'Session Type not found.');
		}

		return sessionType;
	}
});

export const getSessionType = async (
	eid: string,
	tid: string
): Promise<Prisma.EventSessionType | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const sessionType = await prisma.eventSessionType.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: tid }, { slug: tid }]
		}
	});

	if (!sessionType) {
		return null;
	}

	return sessionType;
};
