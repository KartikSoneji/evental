import Prisma from '@eventalapp/shared/db';
import { prisma } from '@eventalapp/shared/db/client';
import { NextkitError } from 'nextkit';

import { api } from '../../../utils/api';

export default api({
	async GET({ ctx }) {
		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		return await getOrganizingEvents(user.id);
	}
});

export const getOrganizingEvents = async (uid: string): Promise<Prisma.Event[]> => {
	return await prisma.event.findMany({
		orderBy: [
			{
				startDate: 'asc'
			}
		],
		where: {
			attendees: {
				some: {
					userId: uid,
					OR: [{ permissionRole: 'FOUNDER' }, { permissionRole: 'ORGANIZER' }]
				}
			}
		}
	});
};