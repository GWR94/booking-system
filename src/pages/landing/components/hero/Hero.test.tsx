import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Hero from './Hero';
import { ThemeProvider } from '@context';

vi.mock('./HeroContent', () => ({
	default: () => <div data-testid="hero-content" />,
}));

vi.mock('./HeroMedia', () => ({
	default: () => <div data-testid="hero-media" />,
}));

vi.mock('./HeroFooter', () => ({
	default: () => <div data-testid="hero-footer" />,
}));

vi.mock('./InformationChips', () => ({
	default: () => <div data-testid="information-chips" />,
}));

describe('Hero', () => {
	it('should render all sub-components', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<Hero />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByTestId('hero-content')).toBeInTheDocument();
		expect(screen.getByTestId('hero-media')).toBeInTheDocument();
		expect(screen.getByTestId('information-chips')).toBeInTheDocument();
		expect(screen.getByTestId('hero-footer')).toBeInTheDocument();
	});
});
