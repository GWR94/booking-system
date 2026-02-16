import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import About from './About';

vi.mock('@shared', () => ({
	CallToAction: () => <div>Call To Action Component</div>,
}));

vi.mock('./components', () => ({
	AboutHero: () => <div>About Hero Component</div>,
	ServicesOverview: () => <div>Services Overview Component</div>,
	Team: () => <div>Team Component</div>,
	BarAndEntertainment: () => <div>Bar And Entertainment Component</div>,
}));

import createWrapper from '@utils/test-utils';

describe('About Page', () => {
	it('renders all child components', () => {
		render(<About />, { wrapper: createWrapper() });

		expect(screen.getByText('About Hero Component')).toBeInTheDocument();
		expect(screen.getByText('Services Overview Component')).toBeInTheDocument();
		expect(
			screen.getByText('Bar And Entertainment Component'),
		).toBeInTheDocument();
		expect(screen.getByText('Team Component')).toBeInTheDocument();
		expect(screen.getByText('Call To Action Component')).toBeInTheDocument();
	});
});
