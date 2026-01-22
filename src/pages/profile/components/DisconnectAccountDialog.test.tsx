import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DisconnectAccountDialog from './DisconnectAccountDialog';
import { unlinkProvider } from '@api';
import { ThemeProvider } from '@context';

vi.mock('@api', () => ({
	unlinkProvider: vi.fn(),
}));

describe('DisconnectAccountDialog', () => {
	const mockOnClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render dialog when open with provider name', () => {
		render(
			<ThemeProvider>
				<DisconnectAccountDialog
					open={true}
					onClose={mockOnClose}
					provider="Google"
				/>
			</ThemeProvider>,
		);

		expect(screen.getByText(/Disconnect Account\?/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to disconnect Google\?/i),
		).toBeInTheDocument();
	});

	it('should call onClose when Cancel is clicked', () => {
		render(
			<ThemeProvider>
				<DisconnectAccountDialog
					open={true}
					onClose={mockOnClose}
					provider="Google"
				/>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Cancel/i));
		expect(mockOnClose).toHaveBeenCalled();
	});

	it('should call unlinkProvider and onClose on success', async () => {
		(unlinkProvider as any).mockResolvedValue({});

		render(
			<ThemeProvider>
				<DisconnectAccountDialog
					open={true}
					onClose={mockOnClose}
					provider="Google"
				/>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Disconnect/i }));

		expect(unlinkProvider).toHaveBeenCalledWith('Google');
		await waitFor(() => {
			expect(mockOnClose).toHaveBeenCalled();
		});
	});

	it('should show error message on failure', async () => {
		const errorResponse = {
			response: {
				data: {
					message: 'You must have at least one login method',
				},
			},
		};
		(unlinkProvider as any).mockRejectedValue(errorResponse);

		render(
			<ThemeProvider>
				<DisconnectAccountDialog
					open={true}
					onClose={mockOnClose}
					provider="Google"
				/>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Disconnect/i }));

		expect(
			await screen.findByText('You must have at least one login method'),
		).toBeInTheDocument();
		expect(mockOnClose).not.toHaveBeenCalled();
	});
});
