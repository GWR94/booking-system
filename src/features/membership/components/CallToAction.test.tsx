import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CallToAction from './CallToAction';
import { ThemeProvider } from '@context';

describe('CallToAction', () => {
	it('should render title and button', () => {
		render(
			<ThemeProvider>
				<CallToAction />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/Lock in member rates and priority booking/i),
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /View plans & subscribe/i }),
		).toBeInTheDocument();
	});
});
