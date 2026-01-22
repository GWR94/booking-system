import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CallToAction from './CallToAction';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
	palette: {
		primary: { main: '#000', dark: '#111', contrastText: '#fff' },
		secondary: { main: '#fff', light: '#eee' },
		accent: { main: '#f00' },
	},
} as any);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

// Mock AnimateIn to simplify
vi.mock('framer-motion', () => ({
	motion: {
		div: ({ children, style, ...props }: any) => (
			<div style={style} {...props} data-testid="motion-div">
				{children}
			</div>
		),
	},
}));

vi.mock('@ui', () => ({
	AnimateIn: ({ children }: any) => <div>{children}</div>,
}));

const renderCTA = () => {
	return render(
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CallToAction />
			</ThemeProvider>
		</BrowserRouter>,
	);
};

describe('CallToAction', () => {
	it('should render heading and call to action text', () => {
		renderCTA();
		expect(
			screen.getByText(/Ready to Improve Your Golf Game?/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Experience TrackMan technology/i),
		).toBeInTheDocument();
	});

	it('should navigate to /book when "Book a Session Now" is clicked', () => {
		renderCTA();
		fireEvent.click(screen.getByText(/Book a Session Now/i));
		expect(mockNavigate).toHaveBeenCalledWith('/book');
	});

	it('should navigate to /membership when "View Membership Options" is clicked', () => {
		renderCTA();
		fireEvent.click(screen.getByText(/View Membership Options/i));
		expect(mockNavigate).toHaveBeenCalledWith('/membership');
	});
});
