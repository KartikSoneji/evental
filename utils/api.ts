import createAPI, { NextkitError } from 'nextkit';
import { randomBytes } from 'crypto';
import { Redis } from '@upstash/redis';
import { prisma } from '../prisma/client';
import type Prisma from '@prisma/client';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type PasswordlessUser = Omit<Prisma.User, 'password'>;

const redis = new Redis({
	url: process.env.UPSTASH_URL!,
	token: process.env.UPSTASH_TOKEN!
});

const getToken = async (): Promise<string> => {
	const token = randomBytes(10).toString('hex');

	const count = await redis.exists(`session:${token}`);

	if (count > 0) {
		return getToken();
	}

	return token;
};

export const ssrGetUser = async (
	req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<PasswordlessUser | null> => {
	const token = await redis.get<string>(`session:${req.cookies.token}`);

	if (!token) {
		return null;
	}

	const user = await prisma.user.findFirst({
		where: {
			id: token
		}
	});

	if (!user) return null;

	const { password, ...rest } = user;

	return rest;
};

export const api = createAPI({
	async getContext(req) {
		return {
			redis,
			getToken,
			getUser: async () => {
				const token = await redis.get<string>(`session:${req.cookies.token}`);

				if (!token) {
					throw new NextkitError(401, "You're not logged in");
				}

				const user = await prisma.user.findFirst({
					where: {
						id: token
					}
				});

				if (!user) return null;

				const { password, ...rest } = user;

				return rest;
			}
		};
	},

	async onError(req, res, error) {
		return {
			status: 500,
			message: error.message
		};
	}
});
