import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ServicesOverview from './ServicesOverview';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme();

// Mock components used in ServicesOverview
vi.mock('@ui', () => ({
	AnimateIn: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	SectionHeader: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('ServicesOverview', () => {
	it('should render all service offers', () => {
		render(
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<ServicesOverview />
				</ThemeProvider>
			</BrowserRouter>,
		);

		expect(screen.getByText('Precision Simulation')).toBeInTheDocument();
		expect(screen.getByText('Professional Coaching')).toBeInTheDocument();
		expect(screen.getByText('The Clubhouse Vibe')).toBeInTheDocument();
		expect(screen.getByText('Private Events')).toBeInTheDocument();
	});

	it('should render links for offers that have them', () => {
		render(
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<ServicesOverview />
				</ThemeProvider>
			</BrowserRouter>,
		);

		expect(screen.getByText('Book a Bay')).toBeInTheDocument();
		expect(screen.getByText('Enquire Now')).toBeInTheDocument();
		expect(screen.getByText('Plan an Event')).toBeInTheDocument();

		// The Clubhouse Vibe doesn't have a link
		expect(screen.queryByText('The Clubhouse Vibe')).toBeInTheDocument();
		const clubhouseOffer = screen
			.getByText('The Clubhouse Vibe')
			.closest('.MuiCard-root');
		expect(clubhouseOffer?.querySelector('a')).toBeNull();
	});
});
