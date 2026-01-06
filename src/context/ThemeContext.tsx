import React, { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { CSSObject } from '@mui/system';
import { themes } from '../styles/themes';

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

	const theme = createTheme({
		palette: {
			mode: 'light',
			...currentTheme.palette,
		},
		typography: {
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
			h1: {
				fontSize: '2.5rem',
				fontWeight: 500,
			},
			title: {
				fontSize: '2.5rem',
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
	});

	return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export { ThemeProvider };
