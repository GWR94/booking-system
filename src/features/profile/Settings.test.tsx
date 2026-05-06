import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Settings from './Settings';
import { ThemeProvider } from '@context';

const mockUser: any = {
	id: '1',
	name: 'Test User',
	email: 'test@example.com',
	membershipTier: 'PAR',
	membershipStatus: 'active',
	bookings: [],
};

const mockUseAuth = vi.fn<() => { user: any | null }>(() => ({ user: mockUser }));

vi.mock('@hooks', () => ({
	useAuth: () => mockUseAuth(),
}));

vi.mock('./components', () => ({
	SubscriptionManagement: ({ user }: { user: typeof mockUser }) => (
		<div data-testid="subscription-management">
			Subscription for {user.email}
		</div>
	),
	DeleteAccountDialog: ({
		dialogOpen,
		onClose,
	}: {
		dialogOpen: boolean;
		onClose: () => void;
	}) =>
		dialogOpen ? (
			<div data-testid="delete-account-dialog">
				<button onClick={onClose}>Close</button>
			</div>
		) : null,
	PendingPaymentBanner: ({ bookingId }: { bookingId: number }) => (
		<div data-testid="pending-payment-banner">{bookingId}</div>
	),
}));

vi.mock('@ui', () => ({
	SectionHeader: ({
		subtitle,
		title,
		description,
	}: {
		subtitle: string;
		title: string;
		description: string;
	}) => (
		<div>
			<span>{subtitle}</span>
			<h2>{title}</h2>
			<p>{description}</p>
		</div>
	),
}));

describe('Settings', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders section header with settings content', () => {
		render(
			<ThemeProvider>
				<Settings />
			</ThemeProvider>,
		);

		expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
		expect(screen.getByText('ACCOUNT')).toBeInTheDocument();
		expect(
			screen.getByText(/Manage your subscription and account preferences/i),
		).toBeInTheDocument();
	});

	it('renders SubscriptionManagement with user', () => {
		render(
			<ThemeProvider>
				<Settings />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('subscription-management')).toBeInTheDocument();
		expect(screen.getByText(/Subscription for test@example\.com/i)).toBeInTheDocument();
	});

	it('renders Danger Zone with Delete Account button', () => {
		render(
			<ThemeProvider>
				<Settings />
			</ThemeProvider>,
		);

		expect(screen.getByText('Danger Zone')).toBeInTheDocument();
		expect(
			screen.getByText(
				/Once you delete your account, there is no going back/i,
			),
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Delete Account/i }),
		).toBeInTheDocument();
	});

	it('opens DeleteAccountDialog when Delete Account is clicked', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<Settings />
			</ThemeProvider>,
		);

		expect(screen.queryByTestId('delete-account-dialog')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /Delete Account/i }));

		expect(screen.getByTestId('delete-account-dialog')).toBeInTheDocument();
	});

	it('closes DeleteAccountDialog when Close is clicked', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<Settings />
			</ThemeProvider>,
		);

		await user.click(screen.getByRole('button', { name: /Delete Account/i }));
		expect(screen.getByTestId('delete-account-dialog')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByTestId('delete-account-dialog')).not.toBeInTheDocument();
	});

	it('renders nothing when user is null', () => {
		mockUseAuth.mockReturnValueOnce({ user: null });
		const { container } = render(
			<ThemeProvider>
				<Settings />
			</ThemeProvider>,
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders pending payment banner when there is a resumable pending booking', () => {
		mockUseAuth.mockReturnValueOnce({
			user: {
				...mockUser,
				bookings: [
					{
						id: 7,
						status: 'pending',
						paymentId: 'pi_abc',
						bookingTime: new Date().toISOString(),
						slots: [{ endTime: new Date(Date.now() + 60_000).toISOString() }],
					},
				],
			},
		});

		render(
			<ThemeProvider>
				<Settings />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('pending-payment-banner')).toHaveTextContent('7');
	});
});
