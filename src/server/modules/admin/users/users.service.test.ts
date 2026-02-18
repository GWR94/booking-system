import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUserFindMany = vi.fn();
const mockUserFindUnique = vi.fn();
const mockUserUpdate = vi.fn();
const mockJwtSign = vi.fn();
const mockHandleSendEmail = vi.fn();

vi.mock('@db', () => ({
	db: {
		user: {
			findMany: (...args: unknown[]) => mockUserFindMany(...args),
			findUnique: (...args: unknown[]) => mockUserFindUnique(...args),
			update: (...args: unknown[]) => mockUserUpdate(...args),
		},
	},
}));

vi.mock('jsonwebtoken', () => ({
	default: {
		sign: (...args: unknown[]) => mockJwtSign(...args),
	},
}));

vi.mock('@utils/email', () => ({
	handleSendEmail: (...args: unknown[]) => mockHandleSendEmail(...args),
}));

import { AdminUsersService } from './users.service';

describe('AdminUsersService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockJwtSign.mockReturnValue('signed-token');
		mockHandleSendEmail.mockResolvedValue(undefined);
	});

	describe('getAllUsers', () => {
		it('should return all users with bookings and slots', async () => {
			const mockUsers = [{ id: 1, email: 'a@b.com', bookings: [] }];
			mockUserFindMany.mockResolvedValue(mockUsers);

			const result = await AdminUsersService.getAllUsers();

			expect(result).toEqual(mockUsers);
			expect(mockUserFindMany).toHaveBeenCalledWith({
				include: {
					bookings: {
						include: {
							slots: { include: { bay: true } },
						},
					},
				},
				orderBy: { id: 'asc' },
			});
		});
	});

	describe('updateUserDetails', () => {
		it('should throw when user not found', async () => {
			mockUserFindUnique.mockResolvedValue(null);

			await expect(
				AdminUsersService.updateUserDetails(999, { name: 'New Name' }),
			).rejects.toThrow('User not found');
			expect(mockUserUpdate).not.toHaveBeenCalled();
		});

		it('should update user with provided fields', async () => {
			mockUserFindUnique.mockResolvedValue({ id: 1, name: 'Old', email: 'old@example.com' });
			const updatedUser = { id: 1, name: 'New Name', email: 'new@example.com' };
			mockUserUpdate.mockResolvedValue(updatedUser);

			const result = await AdminUsersService.updateUserDetails(1, {
				name: 'New Name',
				email: 'new@example.com',
			});

			expect(result.message).toBe('User updated successfully');
			expect(result.user).toEqual(updatedUser);
			expect(mockUserUpdate).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { name: 'New Name', email: 'new@example.com' },
			});
		});

		it('should omit undefined fields from update data', async () => {
			mockUserFindUnique.mockResolvedValue({ id: 1 });
			mockUserUpdate.mockResolvedValue({ id: 1, role: 'admin' });

			await AdminUsersService.updateUserDetails(1, {
				role: 'admin',
			});

			expect(mockUserUpdate).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { role: 'admin' },
			});
		});
	});

	describe('resetUserPassword', () => {
		beforeEach(() => {
			process.env.ACCESS_TOKEN_SECRET = 'test-secret';
		});

		it('should throw when user not found', async () => {
			mockUserFindUnique.mockResolvedValue(null);

			await expect(
				AdminUsersService.resetUserPassword(999),
			).rejects.toThrow('User not found');
			expect(mockHandleSendEmail).not.toHaveBeenCalled();
		});

		it('should throw when user has no email', async () => {
			mockUserFindUnique.mockResolvedValue({ id: 1, email: null, name: 'User' });

			await expect(
				AdminUsersService.resetUserPassword(1),
			).rejects.toThrow('User has no email address');
			expect(mockHandleSendEmail).not.toHaveBeenCalled();
		});

		it('should update user with reset token and send email', async () => {
			mockUserFindUnique.mockResolvedValue({
				id: 1,
				email: 'user@example.com',
				name: 'User',
			});
			mockUserUpdate.mockResolvedValue({});

			const result = await AdminUsersService.resetUserPassword(1);

			expect(result.message).toBe("Password reset link sent to user's email");
			expect(mockJwtSign).toHaveBeenCalledWith(
				{ id: 1, email: 'user@example.com' },
				'test-secret',
				{ expiresIn: '1h' },
			);
			expect(mockUserUpdate).toHaveBeenCalledWith({
				where: { id: 1 },
				data: {
					resetToken: 'signed-token',
					resetTokenExpiry: expect.any(Date),
				},
			});
			expect(mockHandleSendEmail).toHaveBeenCalledWith(
				expect.objectContaining({
					recipientEmail: 'user@example.com',
					subject: 'Admin Requested Password Reset',
					templateName: 'password-reset',
				}),
			);
		});
	});
});
