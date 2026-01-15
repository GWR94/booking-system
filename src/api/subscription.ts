import { axios } from '@utils';

export const createSubscriptionSession = async (tier: string) => {
	const response = await axios.post('/api/user/subscription/create-session', {
		tier,
	});
	return response.data;
};

export const createPortalSession = async () => {
	const response = await axios.post('/api/user/subscription/portal-session');
	return response.data;
};
