import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Login from './Login';

// Mock validateInputs to avoid complex validation logic in unit tests or just fallback to real one if simple
// Doing a partial mock for hooks
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../hooks/useAuth', () => ({
	useAuth: () => ({
		login: mockLogin,
	}),
}));

vi.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate,
	Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock child components that strictly aren't under test to simplify
vi.mock('../components/auth/OAuthButtons', () => ({
	default: () => <div>OAuth Buttons</div>,
}));

vi.mock('../components/auth/ForgotPasswordDialog', () => ({
	default: () => <div>Forgot Password Dialog</div>,
}));

describe('Login Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders login form correctly', () => {
		render(<Login />);
		expect(
			screen.getByRole('heading', { name: /Sign in/i }),
		).toBeInTheDocument();
		expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Sign In/i }),
		).toBeInTheDocument();
	});

	it('updates input fields on user type', () => {
		render(<Login />);
		const emailInput = screen.getByLabelText(
			/Email Address/i,
		) as HTMLInputElement;
		const passwordInput = screen.getByLabelText(
			/Password/i,
		) as HTMLInputElement;

		fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
		fireEvent.change(passwordInput, { target: { value: 'password123' } });

		expect(emailInput.value).toBe('test@example.com');
		expect(passwordInput.value).toBe('password123');
	});

	it('calls login function with correct data when form is submitted', async () => {
		render(<Login />);
		const emailInput = screen.getByLabelText(/Email Address/i);
		const passwordInput = screen.getByLabelText(/Password/i);
		const submitButton = screen.getByRole('button', { name: /Sign In/i });

		// Simulate valid input
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
		fireEvent.change(passwordInput, { target: { value: 'Password123!' } }); // Matches pattern in schema if validated, but legacySignin has its own validation

		// Mock validateInputs in utils if strictly needed, but for integration test on page:
		// The component imports validateInputs. If we don't mock it, it runs real code.
		// Let's rely on real validation if possible, or assume valid for now.
		// NOTE: Login.tsx uses validateInputs from '../utils/validateInput'.
		// If real validation fails, mockLogin won't be called.

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith({
				email: 'test@example.com',
				password: 'Password123!',
			});
		});
	});
});
