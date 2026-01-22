import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import About from './About';

vi.mock('../../components/shared', () => ({
	CallToAction: () => <div>Call To Action Component</div>,
}));

vi.mock('./components', () => ({
	Intro: () => <div>Intro Component</div>,
	OurStory: () => <div>Our Story Component</div>,
	WhatWeOffer: () => <div>What We Offer Component</div>,
	Features: () => <div>Features Component</div>,
	Team: () => <div>Team Component</div>,
	MiniFeatures: () => <div>Mini Features Component</div>,
	BookingPreview: () => <div>Booking Preview Component</div>,
}));

import createWrapper from '@utils/test-utils';

describe('About Page', () => {
	it('renders all child components', () => {
		render(<About />, { wrapper: createWrapper() });

		expect(screen.getByText('Intro Component')).toBeInTheDocument();
		expect(screen.getByText('Mini Features Component')).toBeInTheDocument();
		expect(screen.getByText('Our Story Component')).toBeInTheDocument();
		expect(screen.getByText('Team Component')).toBeInTheDocument();
		expect(screen.getByText('Features Component')).toBeInTheDocument();
		expect(screen.getByText('What We Offer Component')).toBeInTheDocument();
		expect(screen.getByText('Booking Preview Component')).toBeInTheDocument();
		expect(screen.getByText('Call To Action Component')).toBeInTheDocument();
	});
});
