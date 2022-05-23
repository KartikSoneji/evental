import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../../prisma/client';
import { api } from '../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, vid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const venue = await prisma.eventVenue.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(vid) }, { slug: String(vid) }]
			},
			select: {
				id: true
			}
		});

		if (!venue) {
			throw new NextkitError(404, 'Venue not found.');
		}

		await prisma.eventVenue.delete({
			where: {
				id: venue.id
			}
		});
	}
});
