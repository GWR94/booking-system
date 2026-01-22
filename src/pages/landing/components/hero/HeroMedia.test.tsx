import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroMedia from './HeroMedia';
import { ThemeProvider } from '@context';

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="animate-in">{children}</div>
	),
}));

vi.mock('../TestimonialCarousel', () => ({
	default: () => <div data-testid="mock-carousel" />,
}));

describe('HeroMedia', () => {
	it('should render the hero image and carousel', () => {
		render(
			<ThemeProvider>
				<HeroMedia />
			</ThemeProvider>,
		);

		const image = screen.getByAltText(/Premium Golf Simulator/i);
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute('src', '/hero-image.webp');
		expect(screen.getByTestId('mock-carousel')).toBeInTheDocument();
	});
});
