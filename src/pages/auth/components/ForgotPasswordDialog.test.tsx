import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ForgotPasswordDialog from './ForgotPasswordDialog';

vi.mock('@context', () => ({
	useSnackbar: () => ({
		showSnackbar: vi.fn(),
	}),
}));

vi.mock('@api', () => ({
	requestPasswordReset: vi.fn().mockResolvedValue({}),
}));

describe('ForgotPasswordDialog', () => {
	const handleClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should not render when open is false', () => {
		render(<ForgotPasswordDialog open={false} handleClose={handleClose} />);
		expect(screen.queryByText('Reset password')).not.toBeInTheDocument();
	});

	it('should render when open is true', () => {
		render(<ForgotPasswordDialog open={true} handleClose={handleClose} />);
		expect(screen.getByText('Reset password')).toBeInTheDocument();
		expect(
			screen.getByText(/Enter your account's email address/i),
		).toBeInTheDocument();
	});

	it('should call handleClose when Cancel button is clicked', () => {
		render(<ForgotPasswordDialog open={true} handleClose={handleClose} />);
		fireEvent.click(screen.getByText('Cancel'));
		expect(handleClose).toHaveBeenCalledTimes(1);
	});

	it('should call handleClose when form is submitted', async () => {
		render(<ForgotPasswordDialog open={true} handleClose={handleClose} />);
		const emailInput = screen.getByPlaceholderText('Email address');
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

		// Click Continue button (submit)
		fireEvent.click(screen.getByText('Continue'));
		await waitFor(() => {
			expect(handleClose).toHaveBeenCalledTimes(1);
		});
	});
});
