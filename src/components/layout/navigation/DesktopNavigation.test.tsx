import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import DesktopNavigation from './DesktopNavigation';
import { ThemeProvider } from '@context';
import { Home } from '@mui/icons-material';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe('DesktopNavigation', () => {
	const mockNavItems = [
		{ name: 'Home', path: '/', icon: <Home /> },
		{ name: 'About', path: '/about', icon: <Home /> },
	];

	it('should render navigation items', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<DesktopNavigation navItems={mockNavItems} />
				</BrowserRouter>
			</ThemeProvider>,
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('About')).toBeInTheDocument();
	});

	it('should navigate to path when item is clicked', () => {
		render(
			<ThemeProvider>
				<BrowserRouter>
					<DesktopNavigation navItems={mockNavItems} />
				</BrowserRouter>
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('About'));
		expect(mockNavigate).toHaveBeenCalledWith('/about');
	});
});
