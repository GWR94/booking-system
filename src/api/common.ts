import { axios } from '@utils';

export interface ContactData {
	name: string;
	email: string;
	phone?: string;
	subject: string;
	message: string;
}

export const sendContactMessage = async (data: ContactData) => {
	const response = await axios.post('/api/contact', data);
	return response.data;
};
