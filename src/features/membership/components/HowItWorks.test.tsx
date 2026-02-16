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

		expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
		expect(
			screen.getByText(/Select a membership plan that suits your needs/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Once you have an active membership/i),
		).toBeInTheDocument();
	});
});
