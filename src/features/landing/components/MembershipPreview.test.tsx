import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getVitestNextRouterMocks } from '@test/vitest-next-router';
import MembershipPreview from './MembershipPreview';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
	SectionHeader: ({ title, description }: any) => (
		<div>
			<h1>{title}</h1>
			<p>{description}</p>
		</div>
	),
}));

vi.mock('@mui/icons-material', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@mui/icons-material')>();
	return {
		...actual,
		Check: () => <div data-testid="CheckIcon" />,
		Star: () => <div data-testid="StarIcon" />,
	};
});

vi.mock('@/constants/memberships', () => ({
	__esModule: true,
	memberships: [
		{
			tierKey: 'PAR',
			title: 'Par',
			price: '£199.99',
			period: '/month',
			features: ['Feature 1'],
			recommended: false,
		},
		{
			tierKey: 'BIRDIE',
			title: 'Birdie',
			price: '£299.99',
			period: '/month',
			features: ['Feature 1'],
			recommended: true,
		},
		{
			tierKey: 'HOLEINONE',
			title: 'Hole-In-One',
			price: '£399.99',
			period: '/month',
			features: ['Feature 1'],
			recommended: false,
		},
	],
}));

describe('MembershipPreview', () => {
	beforeEach(() => {
		getVitestNextRouterMocks().push.mockClear();
	});

	it('should render title and description', () => {
		render(
			<ThemeProvider>
				<MembershipPreview />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Flexible Membership Plans/i)).toBeInTheDocument();
	});

	it('should render all three membership tiers', () => {
		render(
			<ThemeProvider>
				<MembershipPreview />
			</ThemeProvider>,
		);

		expect(screen.getByText('Par')).toBeInTheDocument();
		expect(screen.getByText('Birdie')).toBeInTheDocument();
		expect(screen.getByText('Hole-In-One')).toBeInTheDocument();
	});

	it('should render prices for tiers', () => {
		render(
			<ThemeProvider>
				<MembershipPreview />
			</ThemeProvider>,
		);

		expect(screen.getByText(/£199.99/i)).toBeInTheDocument();
		expect(screen.getByText(/£299.99/i)).toBeInTheDocument();
		expect(screen.getByText(/£399.99/i)).toBeInTheDocument();
	});

	it('should navigate to /membership when button is clicked', () => {
		render(
			<ThemeProvider>
				<MembershipPreview />
			</ThemeProvider>,
		);

		const viewDetailsBtns = screen.getAllByText(/Choose/i);
		fireEvent.click(viewDetailsBtns[0]);
		expect(getVitestNextRouterMocks().push).toHaveBeenCalledWith('/membership');
	});
});
