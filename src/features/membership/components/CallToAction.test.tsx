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
			screen.getByText(/Ready to Elevate Your Game\?/i),
		).toBeInTheDocument();
		expect(screen.getByText(/Join Now/i)).toBeInTheDocument();
	});
});
