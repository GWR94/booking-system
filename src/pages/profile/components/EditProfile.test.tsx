import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditProfile from './EditProfile';
import { useAuth } from '@hooks';
import { useSnackbar, ThemeProvider } from '@context';
import { updateProfile } from '@api';

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
	updateProfile: vi.fn(),
	unlinkProvider: vi.fn(),
}));

vi.mock('@assets/icons/CustomIcons', () => ({
	FacebookIcon: () => <div data-testid="facebook-icon" />,
	GoogleIcon: () => <div data-testid="google-icon" />,
	XIcon: () => <div data-testid="x-icon" />,
}));

vi.mock('./DeleteAccountDialog', () => ({
	default: ({ dialogOpen }: { dialogOpen: boolean }) =>
		dialogOpen ? <div data-testid="delete-dialog" /> : null,
}));

vi.mock('./DisconnectAccountDialog', () => ({
	default: ({ open, provider }: { open: boolean; provider: string }) =>
		open ? <div data-testid={`disconnect-dialog-${provider}`} /> : null,
}));

vi.mock('./SubscriptionManagement', () => ({
	default: () => <div data-testid="subscription-mgmt" />,
}));

describe('EditProfile', () => {
	const mockShowSnackbar = vi.fn();
	const mockUser = {
		name: 'John Doe',
		email: 'john@example.com',
		passwordHash: 'hashed',
		googleId: 'g123',
	};

	beforeEach(() => {
		vi.clearAllMocks();
		(useAuth as any).mockReturnValue({ user: mockUser });
		(useSnackbar as any).mockReturnValue({ showSnackbar: mockShowSnackbar });
	});

	it('should render initial form values', () => {
		render(
			<ThemeProvider>
				<EditProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		expect(screen.getByLabelText(/Name/i)).toHaveValue('John Doe');
		expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
		expect(screen.getByLabelText(/^Password/i)).toBeDisabled();
	});

	it('should toggle change password fields', () => {
		render(
			<ThemeProvider>
				<EditProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Change Password/i));

		expect(screen.getByLabelText(/Current Password/i)).not.toBeDisabled();
		expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
	});

	it('should call updateProfile and show snackbar on save', async () => {
		(updateProfile as any).mockResolvedValue({});

		render(
			<ThemeProvider>
				<EditProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		fireEvent.change(screen.getByLabelText(/Name/i), {
			target: { value: 'John Updated' },
		});
		fireEvent.click(screen.getByText(/Save Changes/i));

		expect(updateProfile).toHaveBeenCalledWith(
			expect.objectContaining({ name: 'John Updated' }),
		);
		await waitFor(() => {
			expect(mockShowSnackbar).toHaveBeenCalledWith(
				'Profile updated successfully',
				'success',
			);
		});
	});

	it('should show error snackbar on save failure', async () => {
		(updateProfile as any).mockRejectedValue(new Error('Failed'));

		render(
			<ThemeProvider>
				<EditProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Save Changes/i));

		await waitFor(() => {
			expect(mockShowSnackbar).toHaveBeenCalledWith(
				'Failed to update profile',
				'error',
			);
		});
	});

	it('should open delete account dialog', () => {
		render(
			<ThemeProvider>
				<EditProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText(/Delete Account/i));
		expect(screen.getByTestId('delete-dialog')).toBeInTheDocument();
	});

	it('should open disconnect dialog for specific provider', () => {
		render(
			<ThemeProvider>
				<EditProfile handleEditToggle={vi.fn()} />
			</ThemeProvider>,
		);

		const disconnectBtn = screen.getAllByText(/Disconnect/i)[0]; // Google has Id in mockUser
		fireEvent.click(disconnectBtn);
		expect(screen.getByTestId('disconnect-dialog-google')).toBeInTheDocument();
	});
});
