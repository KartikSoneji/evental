import { isFounder } from '../../../../utils/isFounder';
import { api } from '../../../../utils/api';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			return false;
		}

		return await getIsFounder(user?.id, String(eid));
	}
});

export const getIsFounder = async (userId: string | undefined, eid: string): Promise<boolean> => {
	return userId ? await isFounder(userId, String(eid)) : false;
};