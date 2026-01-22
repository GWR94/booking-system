import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axios } from '@utils';
import { sendContactMessage } from './common';

vi.mock('@utils', () => ({
	axios: {
		post: vi.fn(),
	},
}));

describe('common api', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('sendContactMessage should call POST /api/contact', async () => {
		const data = {
			name: 'Test',
			email: 'test@test.com',
			subject: 'Sub',
			message: 'Msg',
		};
		const mockResponse = { success: true };
		(axios.post as any).mockResolvedValue({ data: mockResponse });

		const result = await sendContactMessage(data);

		expect(axios.post).toHaveBeenCalledWith('/api/contact', data);
		expect(result).toEqual(mockResponse);
	});
});
