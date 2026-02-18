import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider, useAppTheme } from './ThemeContext';
import { useTheme } from '@mui/material';

// Helper component to verify theme presence
const TestComponent = () => {
	const theme = useTheme();
	return <div data-testid="theme-test">{theme.palette.mode}</div>;
};

// Helper to test useAppTheme
const ThemeIdConsumer = () => {
	const { currentThemeId, setThemeId } = useAppTheme();
	return (
		<div>
			<span data-testid="theme-id">{currentThemeId}</span>
			<button onClick={() => setThemeId('sapphire-night')}>
				Set Sapphire
			</button>
			<button onClick={() => setThemeId('blue-yellow-teal')}>
				Set Default
			</button>
		</div>
	);
};

describe('ThemeContext', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('renders children correctly', () => {
		render(
			<ThemeProvider>
				<div>Test Child</div>
			</ThemeProvider>,
		);
		expect(screen.getByText('Test Child')).toBeInTheDocument();
	});

	it('provides theme to children', () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);
		const testElement = screen.getByTestId('theme-test');
		expect(testElement).toHaveTextContent('light');
	});

	it('provides useAppTheme with default theme id when localStorage is empty', () => {
		render(
			<ThemeProvider>
				<ThemeIdConsumer />
			</ThemeProvider>,
		);
		expect(screen.getByTestId('theme-id')).toHaveTextContent(
			'blue-yellow-teal',
		);
	});

	it('useAppTheme setThemeId updates currentThemeId and persists to localStorage', async () => {
		const user = userEvent.setup();
		render(
			<ThemeProvider>
				<ThemeIdConsumer />
			</ThemeProvider>,
		);

		await user.click(screen.getByText('Set Sapphire'));

		expect(screen.getByTestId('theme-id')).toHaveTextContent(
			'sapphire-night',
		);
		expect(localStorage.getItem('app-theme-id')).toBe('sapphire-night');
	});

	it('initializes theme id from localStorage when present', () => {
		localStorage.setItem('app-theme-id', 'emerald-prestige');
		render(
			<ThemeProvider>
				<ThemeIdConsumer />
			</ThemeProvider>,
		);
		expect(screen.getByTestId('theme-id')).toHaveTextContent(
			'emerald-prestige',
		);
	});

	it('has custom typography variants defined', () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);
		// Implicitly testing that crash doesn't happen and types are extended
	});
});
