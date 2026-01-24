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

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	// Fixed theme configuration
	const themeId = 'blue-yellow-teal';
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
						fontSize: 'clamp(2.5rem, 8vw, 4rem)',
						fontWeight: 700,
						lineHeight: 1.2,
					},
					h2: {
						fontSize: 'clamp(2rem, 6vw, 3rem)',
						fontWeight: 700,
						lineHeight: 1.3,
					},
					h3: {
						fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
						fontWeight: 600,
						lineHeight: 1.4,
					},
					h4: {
						fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
						fontWeight: 600,
					},
					h5: {
						fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
						fontWeight: 600,
					},
					h6: {
						fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
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
					title: {
						fontSize: 'clamp(2rem, 5vw, 3.5rem)',
						fontWeight: 700,
						color: currentTheme.palette.primary?.main,
						position: 'relative',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
						'&:after': {
							content: '""',
							position: 'absolute',
							bottom: -10,
							left: '50%',
							transform: 'translateX(-50%)',
							width: '40%',
							height: 4,
							backgroundColor: currentTheme.palette.secondary?.main,
						},
					},
				},
			}),
		[currentTheme],
	);

	return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export { ThemeProvider };
