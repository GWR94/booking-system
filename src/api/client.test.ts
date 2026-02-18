import { describe, it, expect, vi } from 'vitest';

const mockCreate = vi.fn((config: { withCredentials?: boolean }) => ({
	defaults: { withCredentials: config.withCredentials ?? false },
	get: vi.fn(),
	post: vi.fn(),
	put: vi.fn(),
	patch: vi.fn(),
	delete: vi.fn(),
}));

vi.mock('axios', () => ({
	default: {
		create: (config: { withCredentials?: boolean }) => mockCreate(config),
	},
}));

describe('api client', () => {
	it('creates axios instance with withCredentials true', async () => {
		const { axios } = await import('./client');
		expect(mockCreate).toHaveBeenCalledWith({ withCredentials: true });
		expect(axios.defaults.withCredentials).toBe(true);
	});

	it('default export is the same as named axios export', async () => {
		const client = await import('./client');
		expect(client.default).toBe(client.axios);
	});
});
