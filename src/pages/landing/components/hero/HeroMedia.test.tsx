import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroMedia from './HeroMedia';

vi.mock('../TestimonialCarousel', () => ({
	default: () => <div data-testid="mock-carousel" />,
}));

describe('HeroMedia', () => {
	it('should render the hero image', () => {
		render(<HeroMedia />);
		// Use console log to see what's happening if it fails
		// screen.debug();
		const image = screen.getByRole('img');
		expect(image).toBeInTheDocument();
	});
});
