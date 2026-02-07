import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeSwitcher from './ThemeSwitcher';
import createWrapper from '@utils/test-utils';
import { useAppTheme } from '@context';
import { ThemeProvider, createTheme } from '@mui/material';

const mockTheme = createTheme({
	palette: {
		link: { light: '#fff', main: '#000', dark: '#000', contrastText: '#fff' },
	},
});

// Mock context
vi.mock('@context', async (importOriginal) => {
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useAppTheme: vi.fn(),
	};
});

describe('ThemeSwitcher', () => {
	const mockSetThemeId = vi.fn();
	const mockOnMobileClick = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(useAppTheme as any).mockReturnValue({
			currentThemeId: 'theme-default',
			setThemeId: mockSetThemeId,
		});
	});

	it('should render trigger button', () => {
		render(
			<ThemeProvider theme={mockTheme}>
				<ThemeSwitcher isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
	});

	it('should open menu on click when not mobile', () => {
		render(
			<ThemeProvider theme={mockTheme}>
				<ThemeSwitcher isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(screen.getByRole('presentation')).toBeInTheDocument(); // Menu
		expect(screen.getByText('Themes')).toBeInTheDocument();
	});

	it('should call onMobileClick when mobile and prop provided', () => {
		render(
			<ThemeProvider theme={mockTheme}>
				<ThemeSwitcher isMobile={true} onMobileClick={mockOnMobileClick} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockOnMobileClick).toHaveBeenCalledTimes(1);
		// Menu should NOT be open
		expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
	});

	it('should render valid theme options in menu', () => {
		render(
			<ThemeProvider theme={mockTheme}>
				<ThemeSwitcher isMobile={false} />
			</ThemeProvider>,
			{ wrapper: createWrapper() },
		);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		const menuItems = screen.getAllByRole('menuitem');
		expect(menuItems.length).toBeGreaterThan(0);

		fireEvent.click(menuItems[0]);
		expect(mockSetThemeId).toHaveBeenCalled();
	});
});
