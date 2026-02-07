import React, { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { CSSObject } from '@mui/system';
import { themes } from '@styles/themes';

// Extend MUI's Typography types to include custom 'title' variant
declare module '@mui/material/styles' {
	interface TypographyVariants {
		title: CSSObject;
		subtitle: CSSObject;
	}

	interface TypographyVariantsOptions {
		title?: CSSObject;
		subtitle?: CSSObject;
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		title: true;
		subtitle: true;
	}
}

const ThemeContext = React.createContext<{
	currentThemeId: string;
	setThemeId: (id: string) => void;
}>({
	currentThemeId: 'blue-yellow-teal',
	setThemeId: () => {},
});

export const useAppTheme = () => React.useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Initialize from local storage or default
	const [themeId, setThemeIdState] = React.useState(() => {
		try {
			const saved = localStorage.getItem('app-theme-id');
			return saved || 'blue-yellow-teal';
		} catch {
			return 'blue-yellow-teal';
		}
	});

	const setThemeId = (id: string) => {
		setThemeIdState(id);
		localStorage.setItem('app-theme-id', id);
	};

	const currentTheme =
		themes.find((theme) => theme.id === themeId) || themes[0];

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: 'light',
					...currentTheme.palette,
				},
				typography: {
					fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
					h1: {
						fontSize: 'clamp(2.5rem, 4vw, 3rem)',
						fontWeight: 700,
						lineHeight: 1.2,
					},
					h2: {
						fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
						fontWeight: 700,
						lineHeight: 1.3,
					},
					h3: {
						fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
						fontWeight: 600,
						lineHeight: 1.4,
					},
					h4: {
						fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
						fontWeight: 600,
					},
					h5: {
						fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
						fontWeight: 600,
					},
					h6: {
						fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)',
						fontWeight: 600,
					},
					subtitle1: {
						fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
					},
					subtitle2: {
						fontSize: 'clamp(0.875rem, 2vw, 1rem)',
					},
					body1: {
						fontSize: 'clamp(1rem, 2vw, 1.05rem)',
					},
					body2: {
						fontSize: 'clamp(0.875rem, 1.8vw, 0.95rem)',
					},
					button: {
						fontSize: 'clamp(0.875rem, 2vw, 1rem)',
					},
					caption: {
						fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
					},
					overline: {
						fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
					},
				},
				components: {
					MuiModal: {
						defaultProps: {
							disableScrollLock: true,
						},
					},
					MuiPopover: {
						defaultProps: {
							disableScrollLock: true,
						},
					},
					MuiMenu: {
						defaultProps: {
							disableScrollLock: true,
						},
					},
					MuiDialog: {
						defaultProps: {
							disableScrollLock: true,
						},
					},
				},
			}),
		[currentTheme],
	);

	return (
		<ThemeContext.Provider value={{ currentThemeId: themeId, setThemeId }}>
			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

export { ThemeProvider };
