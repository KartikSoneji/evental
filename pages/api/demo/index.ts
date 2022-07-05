import { NextkitError } from 'nextkit';

import { api } from '../../../utils/api';
import { sendDemoRequestEmail } from '../../../utils/email/sendDemoRequestEmail';
import { SubmitDemoRequestSchema } from '../../../utils/schemas';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const body = SubmitDemoRequestSchema.parse(req.body);

		await sendDemoRequestEmail({ sendToAddress: 'support@evental.app', payload: body });
	}
});
