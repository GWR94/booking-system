import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Overview from './Overview';
import { ThemeProvider } from '@context';

vi.mock('./components', () => ({
	UserProfile: () => <div data-testid="user-profile">UserProfile</div>,
	PendingPaymentBanner: ({ bookingId }: { bookingId: number }) => (
		<div data-testid="pending-payment-banner">{bookingId}</div>
	),
}));

const mockUseAuth = vi.fn<() => { user: any | null }>(() => ({ user: null }));
vi.mock('@hooks', () => ({
	useAuth: () => mockUseAuth(),
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
		<div data-testid="section-header">
			<span data-testid="subtitle">{subtitle}</span>
			<h2 data-testid="title">{title}</h2>
			<p data-testid="description">{description}</p>
		</div>
	),
}));

describe('Overview', () => {
	it('renders section header with profile overview content', () => {
		render(
			<ThemeProvider>
				<Overview />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('section-header')).toBeInTheDocument();
		expect(screen.getByTestId('subtitle')).toHaveTextContent('PROFILE');
		expect(screen.getByTestId('title')).toHaveTextContent('Overview');
		expect(screen.getByTestId('description')).toHaveTextContent(
			'View and edit your personal information',
		);
	});

	it('renders UserProfile component', () => {
		render(
			<ThemeProvider>
				<Overview />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('user-profile')).toBeInTheDocument();
		expect(screen.getByText('UserProfile')).toBeInTheDocument();
	});

	it('renders pending payment banner when user has resumable pending booking', () => {
		mockUseAuth.mockReturnValueOnce({
			user: {
				bookings: [
					{
						id: 5,
						status: 'pending',
						paymentId: 'pi_123',
						bookingTime: new Date().toISOString(),
						slots: [{ endTime: new Date(Date.now() + 60_000).toISOString() }],
					},
				],
			},
		});
		render(
			<ThemeProvider>
				<Overview />
			</ThemeProvider>,
		);
		expect(screen.getByTestId('pending-payment-banner')).toHaveTextContent('5');
	});
});
