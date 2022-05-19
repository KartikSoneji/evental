import { NextkitError } from 'nextkit';
import { isOrganizer } from '../../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../../utils/api';
import { AddAttendeeToSessionSchema } from '../../../../../../../../utils/schemas';
import { prisma } from '../../../../../../../../prisma/client';
import { getSession } from '../../../../sessions/[sid]';
import { getAttendee } from '../../../../attendees/[uid]';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, sid } = req.query;

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

		let body = AddAttendeeToSessionSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const session = await getSession(String(eid), String(sid));

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		const attendee = await getAttendee(String(eid), String(body.userId));

		if (!attendee) {
			throw new NextkitError(404, 'Attendee not found.');
		}

		await prisma.eventSessionAttendee.delete({
			where: {
				eventId_sessionId_attendeeId: {
					eventId: String(event.id),
					sessionId: String(session.id),
					attendeeId: String(attendee.id)
				}
			}
		});
	}
});