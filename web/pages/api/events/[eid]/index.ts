import Prisma from '@eventalapp/shared/db';
import { prisma } from '@eventalapp/shared/db/client';
import { NextkitError } from 'nextkit';

import { api } from '../../../../utils/api';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		return event;
	}
});

export const getEvent = async (eid: string): Promise<Prisma.Event | null> => {
	return await prisma.event.findFirst({
		where: { OR: [{ id: String(eid) }, { slug: String(eid) }] }
	});
};
