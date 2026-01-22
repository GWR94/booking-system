import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import DeleteAccountDialog from './DeleteAccountDialog';
import { useAuth } from '@hooks';
import { useSnackbar, ThemeProvider } from '@context';
import { deleteAccount } from '@api';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('@hooks', () => ({
	useAuth: vi.fn(),
}));

vi.mock('@context', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useSnackbar: vi.fn(),
	};
});

vi.mock('@api', () => ({
	deleteAccount: vi.fn(),
}));

describe('DeleteAccountDialog', () => {
	const mockLogout = vi.fn();
	const mockShowSnackbar = vi.fn();
	const mockOnClose = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ logout: mockLogout });
		(useSnackbar as any).mockReturnValue({ showSnackbar: mockShowSnackbar });
	});

	it('should render dialog when open', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<DeleteAccountDialog
						dialogOpen={true}
						onClose={mockOnClose}
						fullscreen={false}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/Delete Account\?/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to delete your account\?/i),
		).toBeInTheDocument();
	});

	it('should call onClose when Cancel is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<DeleteAccountDialog
						dialogOpen={true}
						onClose={mockOnClose}
						fullscreen={false}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Cancel/i));
		expect(mockOnClose).toHaveBeenCalled();
	});

	it('should call deleteAccount, logout and navigate on success', async () => {
		(deleteAccount as any).mockResolvedValue({});

		render(
			<ThemeProvider>
				<BrowserRouter>
					<DeleteAccountDialog
						dialogOpen={true}
						onClose={mockOnClose}
						fullscreen={false}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));

		expect(deleteAccount).toHaveBeenCalled();
		await waitFor(() => {
			expect(mockLogout).toHaveBeenCalled();
			expect(mockShowSnackbar).toHaveBeenCalledWith(
				'Account deleted successfully',
				'success',
			);
			expect(mockNavigate).toHaveBeenCalledWith('/');
			expect(mockOnClose).toHaveBeenCalled();
		});
	});

	it('should show error snackbar on failure', async () => {
		(deleteAccount as any).mockRejectedValue(new Error('Failed'));

		render(
			<ThemeProvider>
				<BrowserRouter>
					<DeleteAccountDialog
						dialogOpen={true}
						onClose={mockOnClose}
						fullscreen={false}
					/>
				</BrowserRouter>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Delete Account/i }));

		await waitFor(() => {
			expect(mockShowSnackbar).toHaveBeenCalledWith(
				'Failed to delete account',
				'error',
			);
			expect(mockOnClose).toHaveBeenCalled();
		});
	});
});
