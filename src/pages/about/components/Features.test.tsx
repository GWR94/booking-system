import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Features from './Features';
import { ThemeProvider } from '@context';

describe('Features', () => {
	it('should render all feature highlights', () => {
		render(
			<ThemeProvider>
				<Features />
			</ThemeProvider>,
		);

		// Using a function to find text to be more flexible
		expect(
			screen.getByText((content) => content.includes('Fully Licensed Bar')),
		).toBeInTheDocument();
		expect(
			screen.getByText((content) => content.includes('Membership Tiers')),
		).toBeInTheDocument();
		expect(
			screen.getByText((content) => content.includes('Central Location')),
		).toBeInTheDocument();
		expect(
			screen.getByText((content) => content.includes('Community Focus')),
		).toBeInTheDocument();
		expect(
			screen.getByText((content) => content.includes('Private Events')),
		).toBeInTheDocument();
	});

	it('should render descriptions for each feature', () => {
		render(
			<ThemeProvider>
				<Features />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/Experience golf on TrackMan 4 systems/i),
		).toBeInTheDocument();
	});
});
