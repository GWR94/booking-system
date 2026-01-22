import { Stack, Card as MuiCard, ThemeOptions } from '@mui/material';
import { Palette, PaletteColorOptions, styled } from '@mui/material/styles';

export const SignInContainer = styled(Stack)(({ theme }) => ({
	height: 'calc(100vh - 70px)',
	minHeight: '100%',
	padding: theme.spacing(2),
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	[theme.breakpoints.up('sm')]: {
		padding: theme.spacing(4),
	},
	'&::before': {
		content: '""',
		display: 'block',
		position: 'absolute',
		zIndex: -1,
		inset: 0,
		backgroundImage:
			'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
		backgroundRepeat: 'no-repeat',
		...theme.applyStyles('dark', {
			backgroundImage:
				'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
		}),
	},
}));

export const Card = styled(MuiCard)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	width: '100%',
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	margin: 'auto',
	[theme.breakpoints.up('sm')]: {
		maxWidth: '450px',
	},
	boxShadow:
		'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
	...theme.applyStyles('dark', {
		boxShadow:
			'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
	}),
}));

declare module '@mui/material/styles' {
	interface Palette {
		accent: Palette['primary'];
		link: Palette['primary'];
	}
	interface PaletteOptions {
		accent?: PaletteColorOptions;
		link?: PaletteColorOptions;
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		accent: true;
		link: true;
	}
}

declare module '@mui/material/Badge' {
	interface BadgePropsColorOverrides {
		accent: true;
		link: true;
	}
}

declare module '@mui/material/IconButton' {
	interface IconButtonPropsColorOverrides {
		accent: true;
		link: true;
	}
}

declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsColorOverrides {
		accent: true;
		link: true;
	}
}

declare module '@mui/material/Avatar' {
	interface AvatarPropsColorOverrides {
		accent: true;
		link: true;
	}
}

declare module '@mui/material/Chip' {
	interface ChipPropsColorOverrides {
		accent: true;
		link: true;
	}
}

declare module '@mui/material/Fab' {
	interface FabPropsColorOverrides {
		accent: true;
		link: true;
	}
}

export interface ThemePalette extends ThemeOptions {
	id: string;
	name: string;
	palette: Partial<Palette>;
}

const blueTealYellowTheme: ThemePalette = {
	id: 'blue-teal-yellow',
	name: 'Blue Teal Yellow',
	palette: {
		primary: {
			main: '#264653',
			light: '#4a6b78',
			dark: '#0d2430',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#1d7369', // Darker Teal for >4.5:1 contrast
			light: '#4db6ab',
			dark: '#004d40',
			contrastText: '#ffffff',
		},
		accent: {
			main: '#e9c46a',
			light: '#fff599',
			dark: '#b6953b',
			contrastText: '#000000',
		},
		warning: {
			main: '#f4a261',
			light: '#ffd38f',
			dark: '#bc7335',
			contrastText: '#ffffff',
		},
		error: {
			main: '#e76f51',
			light: '#ff9e7f',
			dark: '#af4226',
			contrastText: '#ffffff',
		},
		success: {
			main: '#4CAF50', // Vibrant green
			light: '#80e27e', // Lighter shade
			dark: '#087f23', // Darker shade
			contrastText: '#ffffff',
		},
		link: {
			main: '#54cebf', // Bright cyan for good contrast on dark primary background
			light: '#7fddd0', // Lighter cyan
			dark: '#2a9d8f', // Darker cyan
			contrastText: '#000000',
		},
	},
};

export const themes: ThemePalette[] = [blueTealYellowTheme];
