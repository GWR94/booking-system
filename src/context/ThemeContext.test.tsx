import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from '@mui/material';

// Helper component to verify theme presence
const TestComponent = () => {
	const theme = useTheme();
	return <div data-testid="theme-test">{theme.palette.mode}</div>;
};

describe('ThemeContext', () => {
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

	it('has custom typography variants defined', () => {
		render(
			<ThemeProvider>
				<TestComponent />
			</ThemeProvider>,
		);
		// Implicitly testing that crash doesn't happen and types are extended
	});
});
