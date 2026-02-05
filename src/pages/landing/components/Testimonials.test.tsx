import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Testimonials from './Testimonials';
import { ThemeProvider } from '@context';

describe('Testimonials', () => {
	it('should render header with overall rating', () => {
		render(
			<ThemeProvider>
				<Testimonials />
			</ThemeProvider>,
		);

		expect(screen.getByText(/What Our Customers Say/i)).toBeInTheDocument();
		expect(
			screen.getByText(/4.8\/5 from over 50 reviews/i),
		).toBeInTheDocument();
	});

	it('should render individual testimonials', () => {
		render(
			<ThemeProvider>
				<Testimonials />
			</ThemeProvider>,
		);

		expect(screen.getByText(/James Wilson/i)).toBeInTheDocument();
		expect(screen.getByText(/Sarah Mitchell/i)).toBeInTheDocument();
		expect(screen.getByText(/Robert Johnson/i)).toBeInTheDocument();
	});

	it('should render testimonial quotes', () => {
		render(
			<ThemeProvider>
				<Testimonials />
			</ThemeProvider>,
		);

		expect(screen.getByText(/best simulator experience/i)).toBeInTheDocument();
	});
});
