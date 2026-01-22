import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Logo from './Logo';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('Logo', () => {
	it('should render default logo image', () => {
		render(
			<BrowserRouter>
				<Logo />
			</BrowserRouter>,
		);
		const img = screen.getByAltText('The Short Grass');
		expect(img).toHaveAttribute('src', 'logo-tagline.webp');
	});

	it('should render dark logo when dark prop is true', () => {
		render(
			<BrowserRouter>
				<Logo dark />
			</BrowserRouter>,
		);
		const img = screen.getByAltText('The Short Grass');
		expect(img).toHaveAttribute('src', 'logo-tagline__dark.webp');
	});

	it('should render logo-only when logoOnly prop is true', () => {
		render(
			<BrowserRouter>
				<Logo logoOnly />
			</BrowserRouter>,
		);
		const img = screen.getByAltText('The Short Grass');
		expect(img).toHaveAttribute('src', 'logo.webp');
	});

	it('should navigate to home on click', () => {
		render(
			<BrowserRouter>
				<Logo />
			</BrowserRouter>,
		);
		fireEvent.click(screen.getByAltText('The Short Grass'));
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});
