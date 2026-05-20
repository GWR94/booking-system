import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ResetPassword from './ResetPassword';
import { ThemeProvider } from '@context';
import { resetPassword } from '@api';

const mockPush = vi.fn();
const mockSearchGet = vi.fn();
const showSnackbar = vi.fn();
const openAuthModal = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: mockPush, replace: vi.fn() }),
	useSearchParams: () => ({ get: mockSearchGet }),
}));

vi.mock('@api', () => ({
	resetPassword: vi.fn(),
}));

vi.mock('@context', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@context')>();
	return {
		...actual,
		useSnackbar: () => ({ showSnackbar }),
		useUI: () => ({ openAuthModal }),
	};
});

describe('ResetPassword', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('shows invalid link state when token is missing', async () => {
		mockSearchGet.mockReturnValue(null);
		render(
			<ThemeProvider>
				<ResetPassword />
			</ThemeProvider>,
		);

		await waitFor(() =>
			expect(screen.getByText(/Invalid Reset Link/i)).toBeInTheDocument(),
		);
	});

	it('back to login from invalid state opens auth modal', async () => {
		mockSearchGet.mockReturnValue(null);
		render(
			<ThemeProvider>
				<ResetPassword />
			</ThemeProvider>,
		);

		await waitFor(() =>
			expect(screen.getByRole('button', { name: /Back to Login/i })).toBeInTheDocument(),
		);
		fireEvent.click(screen.getByRole('button', { name: /Back to Login/i }));
		expect(mockPush).toHaveBeenCalledWith('/');
		expect(openAuthModal).toHaveBeenCalledWith('login');
	});

	it('submits new password and navigates home on success', async () => {
		mockSearchGet.mockImplementation((key: string) =>
			key === 'token' ? 'tok' : null,
		);
		vi.mocked(resetPassword).mockResolvedValue(undefined);

		render(
			<ThemeProvider>
				<ResetPassword />
			</ThemeProvider>,
		);

		await waitFor(() =>
			expect(
				screen.getByRole('heading', { name: /Reset Password/i }),
			).toBeInTheDocument(),
		);

		fireEvent.change(screen.getByLabelText(/^New Password/i), {
			target: { value: 'password1' },
		});
		fireEvent.change(screen.getByLabelText(/^Confirm New Password/i), {
			target: { value: 'password1' },
		});
		fireEvent.click(screen.getByRole('button', { name: /^Reset Password$/i }));

		await waitFor(() =>
			expect(resetPassword).toHaveBeenCalledWith({
				token: 'tok',
				password: 'password1',
			}),
		);
		expect(showSnackbar).toHaveBeenCalledWith(
			expect.stringMatching(/reset successfully/i),
			'success',
		);
		expect(mockPush).toHaveBeenCalledWith('/');
		expect(openAuthModal).toHaveBeenCalledWith('login');
	});

	it('shows error when passwords do not match', async () => {
		mockSearchGet.mockReturnValue('tok');
		render(
			<ThemeProvider>
				<ResetPassword />
			</ThemeProvider>,
		);

		await waitFor(() =>
			expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument(),
		);
		fireEvent.change(screen.getByLabelText(/^New Password/i), {
			target: { value: 'aaaaaaaa' },
		});
		fireEvent.change(screen.getByLabelText(/^Confirm New Password/i), {
			target: { value: 'bbbbbbbb' },
		});
		fireEvent.click(screen.getByRole('button', { name: /^Reset Password$/i }));

		expect(showSnackbar).toHaveBeenCalledWith(
			'Passwords do not match.',
			'error',
		);
		expect(resetPassword).not.toHaveBeenCalled();
	});

	it('shows error when password is too short', async () => {
		mockSearchGet.mockReturnValue('tok');
		render(
			<ThemeProvider>
				<ResetPassword />
			</ThemeProvider>,
		);

		await waitFor(() =>
			expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument(),
		);
		fireEvent.change(screen.getByLabelText(/^New Password/i), {
			target: { value: 'short' },
		});
		fireEvent.change(screen.getByLabelText(/^Confirm New Password/i), {
			target: { value: 'short' },
		});
		fireEvent.click(screen.getByRole('button', { name: /^Reset Password$/i }));

		expect(showSnackbar).toHaveBeenCalledWith(
			'Password must be at least 8 characters long.',
			'error',
		);
	});

	it('shows error when API fails', async () => {
		mockSearchGet.mockImplementation((key: string) =>
			key === 'token' ? 'tok' : null,
		);
		vi.mocked(resetPassword).mockRejectedValue(new Error('fail'));

		render(
			<ThemeProvider>
				<ResetPassword />
			</ThemeProvider>,
		);

		await waitFor(() =>
			expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument(),
		);
		fireEvent.change(screen.getByLabelText(/^New Password/i), {
			target: { value: 'password1' },
		});
		fireEvent.change(screen.getByLabelText(/^Confirm New Password/i), {
			target: { value: 'password1' },
		});
		fireEvent.click(screen.getByRole('button', { name: /^Reset Password$/i }));

		await waitFor(() =>
			expect(showSnackbar).toHaveBeenCalledWith(
				'Failed to reset password. The link may have expired.',
				'error',
			),
		);
	});

	it('toggles password visibility', async () => {
		mockSearchGet.mockImplementation((key: string) =>
			key === 'token' ? 'tok' : null,
		);
		render(
			<ThemeProvider>
				<ResetPassword />
			</ThemeProvider>,
		);

		await waitFor(() =>
			expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument(),
		);
		const pwd = screen.getByLabelText(/^New Password/i) as HTMLInputElement;
		expect(pwd.type).toBe('password');

		fireEvent.click(
			screen.getByRole('button', { name: /toggle password visibility/i }),
		);
		expect(pwd.type).toBe('text');
	});
});
