import React, { Component, type ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorBoundary from './ErrorBoundary';

const theme = createTheme();

class Bomb extends Component<{ explode?: boolean }> {
	override render(): ReactNode {
		if (this.props.explode) throw new Error('Test error');
		return <span>fine</span>;
	}
}

describe('ErrorBoundary', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders children when there is no error', () => {
		render(
			<ThemeProvider theme={theme}>
				<ErrorBoundary>
					<Bomb />
				</ErrorBoundary>
			</ThemeProvider>,
		);
		expect(screen.getByText('fine')).toBeInTheDocument();
	});

	it('renders fallback UI when a child throws', () => {
		render(
			<ThemeProvider theme={theme}>
				<ErrorBoundary>
					<Bomb explode />
				</ErrorBoundary>
			</ThemeProvider>,
		);
		expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /Reload Page/i }),
		).toBeInTheDocument();
	});

	it('shows error details in development', () => {
		const prev = process.env.NODE_ENV;
		vi.stubEnv('NODE_ENV', 'development');
		render(
			<ThemeProvider theme={theme}>
				<ErrorBoundary>
					<Bomb explode />
				</ErrorBoundary>
			</ThemeProvider>,
		);
		expect(screen.getByText(/Error: Test error/i)).toBeInTheDocument();
		vi.stubEnv('NODE_ENV', prev);
	});

	it('reload button calls window.location.reload', () => {
		const reload = vi.fn();
		vi.stubGlobal('location', { ...window.location, reload } as Location);

		render(
			<ThemeProvider theme={theme}>
				<ErrorBoundary>
					<Bomb explode />
				</ErrorBoundary>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByRole('button', { name: /Reload Page/i }));
		expect(reload).toHaveBeenCalled();
	});
});
