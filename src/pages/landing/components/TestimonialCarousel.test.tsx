import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TestimonialCarousel from './TestimonialCarousel';
import { ThemeProvider } from '@context';

// Mock framer-motion
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
	},
	AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TestimonialCarousel', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should render first testimonial by default', () => {
		render(
			<ThemeProvider>
				<TestimonialCarousel />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(
				/"The best simulator experience in Kent! The accuracy of the data is incredible\."/i,
			),
		).toBeInTheDocument();
		expect(screen.getByText(/James Wilson/i)).toBeInTheDocument();
	});

	it('should cycle to next testimonial automatically after timer', () => {
		render(
			<ThemeProvider>
				<TestimonialCarousel />
			</ThemeProvider>,
		);

		act(() => {
			vi.advanceTimersByTime(6000);
		});

		expect(screen.getByText(/Emily Carter/i)).toBeInTheDocument();
	});

	it('should cycle when next button is clicked', () => {
		render(
			<ThemeProvider>
				<TestimonialCarousel />
			</ThemeProvider>,
		);

		// The next button (NavigateNext icon)
		const nextBtn = screen.getByTestId('NavigateNextRoundedIcon')
			.parentElement!;
		fireEvent.click(nextBtn);

		expect(screen.getByText(/Emily Carter/i)).toBeInTheDocument();
	});

	it('should cycle when previous button is clicked', () => {
		render(
			<ThemeProvider>
				<TestimonialCarousel />
			</ThemeProvider>,
		);

		const prevBtn = screen.getByTestId('NavigateBeforeRoundedIcon')
			.parentElement!;
		fireEvent.click(prevBtn);

		// Cycles to the last one (Michael Brown)
		expect(screen.getByText(/Michael Brown/i)).toBeInTheDocument();
	});
});
