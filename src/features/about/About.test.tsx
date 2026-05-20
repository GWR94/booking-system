import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import About from './About';
import createWrapper from '@utils/test-utils';

vi.mock('./components/AboutHero', () => ({
	default: () => <div>About Hero Component</div>,
}));
vi.mock('./components/BarAndEntertainment', () => ({
	default: () => <div>Bar And Entertainment Component</div>,
}));
vi.mock('./components/Team', () => ({
	default: () => <div>Team Component</div>,
}));
vi.mock('@shared/CallToAction', () => ({
	default: () => <div>Call To Action Component</div>,
}));

describe('About Page', () => {
	it('renders hero immediately and lazy sections after load', async () => {
		render(<About />, { wrapper: createWrapper() });

		expect(screen.getByText('About Hero Component')).toBeInTheDocument();

		await waitFor(() => {
			expect(
				screen.getByText('Bar And Entertainment Component'),
			).toBeInTheDocument();
		});
		expect(screen.getByText('Team Component')).toBeInTheDocument();
		expect(screen.getByText('Call To Action Component')).toBeInTheDocument();
	});
});
