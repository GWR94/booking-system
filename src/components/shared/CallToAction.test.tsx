import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CallToAction from './CallToAction';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
	palette: {
		primary: { main: '#000', dark: '#111', contrastText: '#fff' },
		secondary: { main: '#fff', light: '#eee' },
		accent: { main: '#f00' },
	},
} as any);

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

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
		<ThemeProvider theme={theme}>
			<CallToAction />
		</ThemeProvider>,
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
		expect(mockPush).toHaveBeenCalledWith('/book');
	});

	it('should navigate to /membership when "View Membership Options" is clicked', () => {
		renderCTA();
		fireEvent.click(screen.getByText(/View Membership Options/i));
		expect(mockPush).toHaveBeenCalledWith('/membership');
	});
});
