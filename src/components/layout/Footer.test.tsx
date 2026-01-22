import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import Footer from './Footer';
import { ThemeProvider, createTheme } from '@mui/material';
import createWrapper from '@utils/test-utils';

const theme = createTheme({
	palette: {
		primary: { main: '#000', contrastText: '#fff', dark: '#111' },
		secondary: { main: '#eee', light: '#eee' },
		accent: { main: '#f00' },
		error: { main: '#f00', light: '#f11', dark: '#f22' },
		divider: '#ccc',
		grey: { 500: '#999' },
	},
} as any);

// Mock Logo via @ui
vi.mock('@ui', () => ({
	Logo: () => <div data-testid="mock-logo">Logo</div>,
}));

const renderFooter = () => {
	return render(
		<ThemeProvider theme={theme}>
			<Footer />
		</ThemeProvider>,
		{ wrapper: createWrapper() },
	);
};

describe('Footer', () => {
	it('should render logo', () => {
		renderFooter();
		expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
	});

	it('should render social media icons with correct labels', () => {
		renderFooter();
		expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
		expect(screen.getByLabelText('X | Twitter')).toBeInTheDocument();
		expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
		expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
	});

	it('should render navigation links', () => {
		renderFooter();
		expect(screen.getByText('Home')).toHaveAttribute('href', '/');
		expect(screen.getByText('About Us')).toHaveAttribute('href', '/about');
		expect(screen.getByText('Help Center')).toHaveAttribute('href', '/help');
	});

	it('should render contact information', () => {
		renderFooter();
		expect(screen.getByText(/Royal Star Arcade/i)).toBeInTheDocument();
		expect(screen.getByText(/\+44 7986 445123/i)).toBeInTheDocument();
		expect(
			screen.getByText(/theshortgrass@jamesgower.dev/i),
		).toBeInTheDocument();
	});

	it('should render copyright with current year', () => {
		renderFooter();
		const currentYear = new Date().getFullYear().toString();
		expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
		expect(
			screen.getByText(/The Short Grass. All rights reserved./i),
		).toBeInTheDocument();
	});
});
