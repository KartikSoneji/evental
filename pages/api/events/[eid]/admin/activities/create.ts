import { prisma } from '../../../../../../prisma/client';
import { CreateActivitySchema } from '../../../../../../utils/schemas';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { processSlug } from '../../../../../../utils/slugify';
import { api } from '../../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}
		const parsed = CreateActivitySchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		let createdActivity = await prisma.eventActivity.create({
			data: {
				eventId: event.id,
				slug: processSlug(parsed.slug),
				name: parsed.name,
				venueId: parsed.venueId,
				startDate: parsed.startDate,
				endDate: parsed.endDate,
				description: parsed.description
			}
		});

		if (!createdActivity) {
			throw new NextkitError(500, 'Error creating activity.');
		}

		return createdActivity;
	}
});
