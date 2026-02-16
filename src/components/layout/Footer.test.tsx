import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';
import { ThemeProvider, createTheme } from '@mui/material';
import createWrapper from '@utils/test-utils';
import { useRouter } from 'next/navigation';

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

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: pushMock,
	}),
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
		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('About Us')).toBeInTheDocument();
		expect(screen.getByText('Help Center')).toBeInTheDocument();
		expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
		expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
		expect(screen.getByText('Cookies Policy')).toBeInTheDocument();
	});

	it('should navigate to the home page when the home link is clicked', () => {
		renderFooter();
		const homeLink = screen.getByText('Home');
		fireEvent.click(homeLink);
		expect(pushMock).toHaveBeenCalledWith('/');
	});

	it('should navigate to the about page when the about link is clicked', () => {
		renderFooter();
		const aboutLink = screen.getByText('About Us');
		fireEvent.click(aboutLink);
		expect(pushMock).toHaveBeenCalledWith('/about');
	});

	it('should navigate to the help page when the help link is clicked', () => {
		renderFooter();
		const helpLink = screen.getByText('Help Center');
		fireEvent.click(helpLink);
		expect(pushMock).toHaveBeenCalledWith('/help');
	});

	it('should navigate to the terms page when the terms link is clicked', () => {
		renderFooter();
		const termsLink = screen.getByText('Terms & Conditions');
		fireEvent.click(termsLink);
		expect(pushMock).toHaveBeenCalledWith('/terms');
	});

	it('should navigate to the privacy page when the privacy link is clicked', () => {
		renderFooter();
		const privacyLink = screen.getByText('Privacy Policy');
		fireEvent.click(privacyLink);
		expect(pushMock).toHaveBeenCalledWith('/privacy');
	});

	it('should navigate to the cookies page when the cookies link is clicked', () => {
		renderFooter();
		const cookiesLink = screen.getByText('Cookies Policy');
		fireEvent.click(cookiesLink);
		expect(pushMock).toHaveBeenCalledWith('/cookies');
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
