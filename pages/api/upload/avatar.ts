import { NextkitError } from 'nextkit';

import { api } from '../../../utils/api';
import { busboyParseForm } from '../../../utils/busboyParseForm';
import { uploadAndProcessAvatar } from '../../../utils/uploadAndProcessImage';

export const config = {
	api: {
		bodyParser: false
	}
};

export type ImageUploadResponse = {
	pathName?: string;
};

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const { buffer, mimeType } = await busboyParseForm(req);

		let fileLocation = await uploadAndProcessAvatar(buffer, mimeType);

		if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
		}

		const body: ImageUploadResponse = {
			pathName: fileLocation
		};

		return body;
	}
});
