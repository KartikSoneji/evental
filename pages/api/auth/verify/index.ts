import { NextkitError } from 'nextkit';

import { prisma } from '../../../../prisma/client';
import { api } from '../../../../utils/api';
import { VERIFY_EMAIL_EXPIRY } from '../../../../utils/config';
import { sendWelcomeEmail } from '../../../../utils/email/sendWelcomeEmail';
import { VerifyEmailSchema } from '../../../../utils/schemas';

export default api({
	async POST({ ctx, req }) {
		const body = VerifyEmailSchema.parse(req.body);

		const userId = await ctx.redis.get<string>(`verify:${body.code}`);

		if (!userId) {
			throw new NextkitError(
				400,
				`Invalid verification code. Verification codes expire after ${
					VERIFY_EMAIL_EXPIRY / 60
				} minutes. Please request another.`
			);
		}

		await ctx.redis.del(`verify:${body.code}`);

		const user = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				emailVerified: new Date()
			}
		});

		try {
			await sendWelcomeEmail(user.email, user.name);
		} catch {
			// silent fail
		}

		const { password, ...rest } = user;

		return rest;
	}
});
