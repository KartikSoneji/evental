import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { generateSlug } from '../../../../../../utils/generateSlug';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { CreateSessionSchema } from '../../../../../../utils/schemas';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

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

		const parsed = CreateSessionSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const slug = await generateSlug(parsed.name, async (val) => {
			return !Boolean(
				await prisma.eventSession.findFirst({
					where: {
						eventId: event.id,
						slug: val
					}
				})
			);
		});

		let createdSession = await prisma.eventSession.create({
			data: {
				eventId: event.id,
				slug: slug,
				name: parsed.name,
				venueId: parsed.venueId,
				startDate: parsed.startDate,
				endDate: parsed.endDate,
				description: parsed.description,
				typeId: parsed.typeId
			}
		});

		if (!createdSession) {
			throw new NextkitError(500, 'Error creating session.');
		}

		return createdSession;
	}
});
