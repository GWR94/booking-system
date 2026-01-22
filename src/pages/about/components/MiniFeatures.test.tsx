import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MiniFeatures from './MiniFeatures';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

describe('MiniFeatures', () => {
	it('should render all mini features', () => {
		render(
			<ThemeProvider>
				<MiniFeatures />
			</ThemeProvider>,
		);

		expect(screen.getByText(/TrackMan 4 Technology/i)).toBeInTheDocument();
		expect(screen.getByText(/100\+ World-Class Courses/i)).toBeInTheDocument();
		expect(screen.getByText(/Open Year-Round/i)).toBeInTheDocument();
		expect(screen.getByText(/Professional Coaching/i)).toBeInTheDocument();
	});

	it('should render descriptions for each mini feature', () => {
		render(
			<ThemeProvider>
				<MiniFeatures />
			</ThemeProvider>,
		);

		expect(
			screen.getByText(
				/Experience the same radar technology used by the pros/i,
			),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Play iconic venues like St Andrews/i),
		).toBeInTheDocument();
	});
});
