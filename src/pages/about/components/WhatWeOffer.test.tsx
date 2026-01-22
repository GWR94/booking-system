import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WhatWeOffer from './WhatWeOffer';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

describe('WhatWeOffer', () => {
	it('should render title', () => {
		render(
			<ThemeProvider>
				<WhatWeOffer />
			</ThemeProvider>,
		);

		expect(screen.getByText(/What We Offer/i)).toBeInTheDocument();
	});

	it('should render all three categories', () => {
		render(
			<ThemeProvider>
				<WhatWeOffer />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/State-of-the-Art Simulators/i),
		).toBeInTheDocument();
		expect(screen.getByText(/Professional Coaching/i)).toBeInTheDocument();
		expect(screen.getByText(/Events & Competitions/i)).toBeInTheDocument();
	});

	it('should render checklist items', () => {
		render(
			<ThemeProvider>
				<WhatWeOffer />
			</ThemeProvider>,
		);

		expect(screen.getByText(/HD course visualization/i)).toBeInTheDocument();
		expect(screen.getByText(/Video swing analysis/i)).toBeInTheDocument();
		expect(screen.getByText(/Corporate packages/i)).toBeInTheDocument();
	});
});
