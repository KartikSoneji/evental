import Prisma from '@eventalapp/shared/db';
import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../utils/api';

export default api({
	async GET() {
		return await getUpcomingEvents();
	}
});

export const getUpcomingEvents = async (): Promise<Prisma.Event[]> => {
	return await prisma.event.findMany({
		where: {
			privacy: 'PUBLIC'
		},
		orderBy: [
			{
				startDate: 'asc'
			}
		]
	});
};