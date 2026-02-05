import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MembershipPreview from './MembershipPreview';
import { ThemeProvider } from '@context';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

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

vi.mock('@mui/icons-material', () => ({
	Check: () => <div data-testid="CheckIcon" />,
	Star: () => <div data-testid="StarIcon" />,
}));

vi.mock('@constants/memberships', () => ({
	__esModule: true,
	default: [
		{
			title: 'Par',
			price: '£199.99',
			period: '/month',
			features: ['Feature 1'],
			recommended: false,
		},
		{
			title: 'Birdie',
			price: '£299.99',
			period: '/month',
			features: ['Feature 1'],
			recommended: true,
		},
		{
			title: 'Hole-In-One',
			price: '£399.99',
			period: '/month',
			features: ['Feature 1'],
			recommended: false,
		},
	],
}));

describe('MembershipPreview', () => {
	it('should render title and description', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/Flexible Membership Plans/i)).toBeInTheDocument();
	});

	it('should render all three membership tiers', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText('Par')).toBeInTheDocument();
		expect(screen.getByText('Birdie')).toBeInTheDocument();
		expect(screen.getByText('Hole-In-One')).toBeInTheDocument();
	});

	it('should render prices for tiers', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText(/£199.99/i)).toBeInTheDocument();
		expect(screen.getByText(/£299.99/i)).toBeInTheDocument();
		expect(screen.getByText(/£399.99/i)).toBeInTheDocument();
	});

	it('should navigate to /membership when button is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<MembershipPreview />
				</BrowserRouter>
			</ThemeProvider>,
		);

		const viewDetailsBtns = screen.getAllByText(/Choose/i);
		fireEvent.click(viewDetailsBtns[0]);
		expect(mockNavigate).toHaveBeenCalledWith('/membership');
	});
});
