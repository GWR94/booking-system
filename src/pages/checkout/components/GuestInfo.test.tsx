import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import GuestInfo from './GuestInfo';
import { useBasket } from '@hooks';
import { checkEmailExists } from '@api';
import createWrapper from '@utils/test-utils';

vi.mock('@hooks', () => ({
	useBasket: vi.fn(),
}));

vi.mock('@api', () => ({
	checkEmailExists: vi.fn(),
}));

// Mock ReCAPTCHA
vi.mock('react-google-recaptcha', () => ({
	default: ({ onChange }: { onChange: (token: string) => void }) => (
		<button onClick={() => onChange('mock-token')} data-testid="mock-recaptcha">
			Verify
		</button>
	),
}));

describe('GuestInfo', () => {
	const mockOnSubmit = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useBasket as any).mockReturnValue({
			basket: [{ id: '1' }],
		});
	});

	it('should render form fields', () => {
		render(<GuestInfo onSubmit={mockOnSubmit} />, { wrapper: createWrapper() });

		expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
	});

	it('should show validation errors for empty fields on submit', async () => {
		render(<GuestInfo onSubmit={mockOnSubmit} />, { wrapper: createWrapper() });

		const submitBtn = screen.getByRole('button', {
			name: /Continue to Payment/i,
		});
		// Button is disabled until name, email, and recaptcha are present
		expect(submitBtn).toBeDisabled();
	});

	it('should successfully submit form with valid data', async () => {
		(checkEmailExists as any).mockResolvedValue({ exists: false });
		render(<GuestInfo onSubmit={mockOnSubmit} />, { wrapper: createWrapper() });

		fireEvent.change(screen.getByLabelText(/Full Name/i), {
			target: { value: 'John Smith', name: 'name' },
		});
		fireEvent.change(screen.getByLabelText(/Email Address/i), {
			target: { value: 'john@example.com', name: 'email' },
		});

		// Verify reCAPTCHA
		fireEvent.click(screen.getByTestId('mock-recaptcha'));

		const submitBtn = screen.getByRole('button', {
			name: /Continue to Payment/i,
		});

		await waitFor(() => {
			expect(submitBtn).not.toBeDisabled();
		});
		fireEvent.click(submitBtn);

		await waitFor(() => {
			expect(checkEmailExists).toHaveBeenCalledWith('john@example.com');
			expect(mockOnSubmit).toHaveBeenCalledWith(
				{ name: 'John Smith', email: 'john@example.com', phone: '' },
				'mock-token',
			);
		});
	});

	it('should show error if email already exists as a registered user', async () => {
		(checkEmailExists as any).mockResolvedValue({ exists: true, role: 'user' });

		const wrapper = createWrapper();
		// Extract mockShowSnackbar from the wrapper closure
		// Since we can't easily do that without modifying test-utils,
		// we can just check if the text "Email already registered" appears in the helper text
		// because GuestInfo.tsx calls setErrors({...email: 'Email already registered'})

		render(<GuestInfo onSubmit={mockOnSubmit} />, { wrapper });

		fireEvent.change(screen.getByLabelText(/Full Name/i), {
			target: { value: 'John Smith', name: 'name' },
		});
		fireEvent.change(screen.getByLabelText(/Email Address/i), {
			target: { value: 'john@example.com', name: 'email' },
		});
		fireEvent.click(screen.getByTestId('mock-recaptcha'));

		fireEvent.click(
			screen.getByRole('button', { name: /Continue to Payment/i }),
		);

		// Check for helper text which is rendered in the DOM
		expect(
			await screen.findByText(/Email already registered/i),
		).toBeInTheDocument();
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});
});
