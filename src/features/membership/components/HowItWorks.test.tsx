import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HowItWorks from './HowItWorks';
import { ThemeProvider } from '@context';

describe('HowItWorks', () => {
	it('should render title and description', () => {
		render(
			<ThemeProvider>
				<HowItWorks />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/Monthly playing hours included on every plan/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Member savings on food and drinks, plus priority booking windows/i,
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				/Higher tiers add full weekend access and complimentary club storage/i,
			),
		).toBeInTheDocument();
	});
});
