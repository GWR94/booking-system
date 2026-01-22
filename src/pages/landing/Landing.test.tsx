import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import Landing from './Landing';
import { HelmetProvider } from 'react-helmet-async';

vi.mock('./components/hero/Hero', () => ({
	default: () => <div>Hero Component</div>,
}));

// Mock the components that are lazily loaded
vi.mock('./components/Features', () => ({
	default: () => <div>Features Component</div>,
}));
vi.mock('./components/Testimonials', () => ({
	default: () => <div>Testimonials Component</div>,
}));
vi.mock('./components/Stats', () => ({
	default: () => <div>Stats Component</div>,
}));
vi.mock('./components/FeaturedCourses', () => ({
	default: () => <div>Featured Courses Component</div>,
}));
vi.mock('./components/MembershipPreview', () => ({
	default: () => <div>Membership Preview Component</div>,
}));
vi.mock('@shared/CallToAction', () => ({
	default: () => <div>Call To Action Component</div>,
}));

describe('Landing Page', () => {
	it('renders all landing page sections', async () => {
		render(
			<HelmetProvider>
				<MemoryRouter>
					<Landing />
				</MemoryRouter>
			</HelmetProvider>,
		);

		// Hero is eager
		expect(screen.getByText('Hero Component')).toBeInTheDocument();

		// Others are lazy
		await waitFor(() => {
			expect(
				screen.getByText('Featured Courses Component'),
			).toBeInTheDocument();
		});
		expect(screen.getByText('Features Component')).toBeInTheDocument();
		expect(screen.getByText('Stats Component')).toBeInTheDocument();
		expect(
			screen.getByText('Membership Preview Component'),
		).toBeInTheDocument();
		expect(screen.getByText('Testimonials Component')).toBeInTheDocument();
		expect(screen.getByText('Call To Action Component')).toBeInTheDocument();
	});
});
