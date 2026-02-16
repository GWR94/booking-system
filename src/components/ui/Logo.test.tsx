import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import Logo from './Logo';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

describe('Logo', () => {
	it('should render default logo image', () => {
		render(<Logo />);
		const img = screen.getByAltText('The Short Grass');
		expect(img).toHaveAttribute('src', 'logo-tagline.webp');
	});

	it('should render dark logo when dark prop is true', () => {
		render(<Logo dark />);
		const img = screen.getByAltText('The Short Grass');
		expect(img).toHaveAttribute('src', 'logo-tagline__dark.webp');
	});

	it('should render logo-only when logoOnly prop is true', () => {
		render(<Logo logoOnly />);
		const img = screen.getByAltText('The Short Grass');
		expect(img).toHaveAttribute('src', 'logo.webp');
	});

	it('should navigate to home on click', () => {
		render(<Logo />);
		fireEvent.click(screen.getByAltText('The Short Grass'));
		expect(mockPush).toHaveBeenCalledWith('/');
	});
});
