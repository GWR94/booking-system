import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FloatingButton from './FloatingButton';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

describe('FloatingButton', () => {
	it('should render children', () => {
		render(
			<ThemeProvider theme={theme}>
				<FloatingButton>
					<span data-testid="child">Click Me</span>
				</FloatingButton>
			</ThemeProvider>,
		);
		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('should render with custom sx', () => {
		render(
			<ThemeProvider theme={theme}>
				<FloatingButton sx={{ opacity: 0.5 }}>
					<span>Opacity Test</span>
				</FloatingButton>
			</ThemeProvider>,
		);
		expect(screen.getByText('Opacity Test')).toBeInTheDocument();
	});
});
