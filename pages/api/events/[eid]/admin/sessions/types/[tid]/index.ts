import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../../../prisma/client';
import { api } from '../../../../../../../../utils/api';
import { generateSlug } from '../../../../../../../../utils/generateSlug';
import { isOrganizer } from '../../../../../../../../utils/isOrganizer';
import { EditSessionTypeSchema } from '../../../../../../../../utils/schemas';
import { getEvent } from '../../../../index';
import { getSessionType } from '../../../../sessions/types/[tid]';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, tid } = req.query;

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

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const sessionType = await prisma.eventSessionType.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(tid) }, { slug: String(tid) }]
			},
			select: {
				id: true
			}
		});

		if (!sessionType) {
			throw new NextkitError(404, 'Session not found.');
		}

		await prisma.eventSessionType.delete({
			where: {
				id: sessionType.id
			}
		});
	},
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, tid } = req.query;

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

		const body = EditSessionTypeSchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const sessionType = await getSessionType(String(eid), String(tid));

		if (!sessionType) {
			throw new NextkitError(404, 'Session Type not found.');
		}

		const slug: string | undefined =
			body.name !== sessionType.name
				? await generateSlug(body.name, async (val) => {
						return !Boolean(
							await prisma.eventSession.findFirst({
								where: {
									eventId: event.id,
									slug: val
								}
							})
						);
				  })
				: undefined;

		const editedSession = await prisma.eventSessionType.update({
			where: {
				id: sessionType.id
			},
			data: {
				eventId: event.id,
				slug,
				name: body.name,
				color: body.color
			}
		});

		if (!editedSession) {
			throw new NextkitError(500, 'Error editing session type.');
		}

		return editedSession;
	}
});