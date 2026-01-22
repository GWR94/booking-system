import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroFooter from './HeroFooter';
import { ThemeProvider } from '@context';

describe('HeroFooter', () => {
	it('should render address, hours and phone number', () => {
		render(
			<ThemeProvider>
				<HeroFooter />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(/High St, Maidstone ME14 1JL, UK/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Open Mon-Sat | 10:00 AM - 10:00 PM/i),
		).toBeInTheDocument();
		expect(screen.getByText(/\+44 79874 45123/i)).toBeInTheDocument();
	});
});
