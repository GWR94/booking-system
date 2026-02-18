import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import LoginForm from './LoginForm';
import { useAuth } from '@hooks';
import createWrapper from '@utils/test-utils';

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
	useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

const renderLoginForm = (props?: { onSuccess?: () => void; onRegisterClick?: () => void }) => {
	return render(<LoginForm {...props} />, { wrapper: createWrapper() });
};

describe('LoginForm', () => {
	const mockLogin = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
			login: mockLogin,
			isLoading: false,
		});
	});

	it('renders email, password, remember me, and sign in button', () => {
		renderLoginForm();
		expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Remember me/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
	});

	it('disables submit when email or password is empty', () => {
		renderLoginForm();
		expect(screen.getByRole('button', { name: /Sign In/i })).toBeDisabled();
		fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
			target: { value: 'a@b.com' },
		});
		expect(screen.getByRole('button', { name: /Sign In/i })).toBeDisabled();
		fireEvent.change(screen.getByPlaceholderText('••••••'), {
			target: { value: 'pass' },
		});
		expect(screen.getByRole('button', { name: /Sign In/i })).not.toBeDisabled();
	});

	it('calls login and onSuccess when provided and submit succeeds', async () => {
		mockLogin.mockResolvedValue(undefined);
		const onSuccess = vi.fn();
		renderLoginForm({ onSuccess });

		fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
			target: { value: 'user@example.com' },
		});
		// Password must pass validation: uppercase + special char
		fireEvent.change(screen.getByPlaceholderText('••••••'), {
			target: { value: 'Password1!' },
		});
		fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				email: 'user@example.com',
				password: 'Password1!',
			});
		});
		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalled();
		});
	});

	it('calls onRegisterClick when Sign up link is clicked in modal mode', () => {
		const onRegisterClick = vi.fn();
		renderLoginForm({ onRegisterClick });
		fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));
		expect(onRegisterClick).toHaveBeenCalled();
	});

	it('renders register link with href when onRegisterClick not provided', () => {
		renderLoginForm();
		const link = screen.getByRole('link', { name: /Sign up/i });
		expect(link).toHaveAttribute('href', '/register');
	});

	it('opens forgot password when Forgot your password is clicked', () => {
		renderLoginForm();
		fireEvent.click(screen.getByRole('button', { name: /Forgot your password/i }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('shows Sign up text', () => {
		renderLoginForm();
		expect(screen.getByText(/Don't have an account/)).toBeInTheDocument();
	});
});
