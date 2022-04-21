import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

	try {
		let eventFound = await prisma.event.findFirst({ where: { id: String(eid) } });

		return res.status(200).send(eventFound);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
