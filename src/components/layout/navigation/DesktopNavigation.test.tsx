import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DesktopNavigation from './DesktopNavigation';
import { ThemeProvider } from '@context';
import { Home } from '@mui/icons-material';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
	usePathname: () => '/',
}));

describe('DesktopNavigation', () => {
	const mockNavItems = [
		{ name: 'Home', path: '/', icon: <Home /> },
		{ name: 'Book', path: '/book', icon: <Home /> },
	];

	it('should render navigation items', () => {
		render(
			<ThemeProvider>
				<DesktopNavigation navItems={mockNavItems} />
			</ThemeProvider>,
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Book')).toBeInTheDocument();
	});

	it('should navigate to path when item is clicked', () => {
		render(
			<ThemeProvider>
				<DesktopNavigation navItems={mockNavItems} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('Book'));
		expect(mockPush).toHaveBeenCalledWith('/book');
	});
});
