import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FAQ from './MembershipFAQ';
import { ThemeProvider } from '@context';

describe('FAQ', () => {
	it('should render FAQ title', () => {
		render(
			<ThemeProvider>
				<FAQ />
			</ThemeProvider>,
		);

		expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument();
	});

	it('should render all FAQ questions', () => {
		render(
			<ThemeProvider>
				<FAQ />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/Can I cancel my membership anytime\?/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/What happens if I exceed my monthly hours\?/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Can I upgrade or downgrade my membership\?/i),
		).toBeInTheDocument();
	});

	it('should expand accordion to show answer', () => {
		render(
			<ThemeProvider>
				<FAQ />
			</ThemeProvider>,
		);

		const firstQuestion = screen.getByText(
			/Can I cancel my membership anytime\?/i,
		);
		fireEvent.click(firstQuestion);

		expect(
			screen.getByText(
				/Your access will remain active until the end of the current billing cycle/i,
			),
		).toBeInTheDocument();
	});
});
