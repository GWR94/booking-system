import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import LegacyRegister from './LegacyRegister';
import { useAuth } from '@hooks';
import { useUI } from '@context';
import createWrapper from '@utils/test-utils';

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
}));

vi.mock('@context', () => ({
	useUI: vi.fn(),
}));

const renderLegacyRegister = () => {
	return render(<LegacyRegister />, { wrapper: createWrapper() });
};

describe('LegacyRegister', () => {
	const mockRegister = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({
			register: mockRegister,
			isLoading: false,
		});
		(useUI as any).mockReturnValue({ openAuthModal: vi.fn() });
	});

	it('should render registration form fields', () => {
		renderLegacyRegister();

		expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
		// Use placeholder for email; MUI label/input association can be unreliable in jsdom
		expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
		expect(
			screen.getByRole('textbox', { name: /Full Name/i }),
		).toBeInTheDocument();

		// For password fields, they are roles "textbox" usually if not "password",
		// but specifically check for the Password field.
		// Mui label text is for the internal input.
		expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
		expect(
			screen.getByLabelText(/I want to receive updates via email/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Sign up/i }),
		).toBeInTheDocument();
	});

	it('should show validation errors on blur for empty fields', async () => {
		renderLegacyRegister();

		const nameInput = screen.getByLabelText(/Full Name/i);
		fireEvent.blur(nameInput);
		expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();

		const emailInput = screen.getByPlaceholderText('your@email.com');
		fireEvent.blur(emailInput);
		expect(
			await screen.findByText(/Please enter a valid email address/i),
		).toBeInTheDocument();
	});

	it('should show password match error', async () => {
		renderLegacyRegister();

		// Use the more specific anchored regex or select by name/id
		const passwordInput = screen.getByLabelText(/^Password/i);
		const confirmInput = screen.getByLabelText(/Confirm Password/i);

		fireEvent.change(passwordInput, {
			target: { value: 'Pass123!' },
		});
		fireEvent.change(confirmInput, {
			target: { value: 'Pass124!' },
		});
		fireEvent.blur(confirmInput);

		expect(
			await screen.findByText(/Passwords must match/i),
		).toBeInTheDocument();
	});

	it('should call register function with valid inputs', async () => {
		mockRegister.mockResolvedValue(true);
		renderLegacyRegister();

		fireEvent.change(screen.getByLabelText(/Full Name/i), {
			target: { value: 'John Doe' },
		});
		fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
			target: { value: 'john@example.com' },
		});
		fireEvent.change(screen.getByLabelText(/^Password/i), {
			target: { value: 'Pass123!' },
		});
		fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
			target: { value: 'Pass123!' },
		});

		fireEvent.click(screen.getByRole('button', { name: /Sign up/i }));

		await waitFor(() => {
			expect(mockRegister).toHaveBeenCalledWith({
				name: 'John Doe',
				email: 'john@example.com',
				password: 'Pass123!',
			});
		});
	});

	it('should show loading state on button when and isLoading is true', () => {
		(useAuth as any).mockReturnValue({
			register: mockRegister,
			isLoading: true,
		});

		renderLegacyRegister();
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('should open auth modal when sign in link is clicked', () => {
		const mockOpenAuthModal = vi.fn();
		(useUI as any).mockReturnValue({ openAuthModal: mockOpenAuthModal });

		renderLegacyRegister();

		fireEvent.click(screen.getByText(/Sign in/i));
		expect(mockOpenAuthModal).toHaveBeenCalledWith('login');
	});
});
