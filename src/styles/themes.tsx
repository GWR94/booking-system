import { Stack, Card as MuiCard, ThemeOptions } from '@mui/material';
import { Palette, PaletteColorOptions, styled } from '@mui/material/styles';

export const SignInContainer = styled(Stack)(({ theme }) => ({
	height: 'calc(100vh - 70px)', // Change from '100dvh' to '100vh'
	minHeight: '100%',
	padding: theme.spacing(2),
	display: 'flex', // Ensure it uses flexbox
	justifyContent: 'center', // Center vertically
	alignItems: 'center', // Center horizontally
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
	}
	interface PaletteOptions {
		accent?: PaletteColorOptions;
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		accent: true;
	}
}

declare module '@mui/material/Badge' {
	interface BadgePropsColorOverrides {
		accent: true;
	}
}

declare module '@mui/material/IconButton' {
	interface IconButtonPropsColorOverrides {
		accent: true;
	}
}

declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsColorOverrides {
		accent: true;
	}
}

declare module '@mui/material/Avatar' {
	interface AvatarPropsColorOverrides {
		accent: true;
	}
}

declare module '@mui/material/Chip' {
	interface ChipPropsColorOverrides {
		accent: true;
	}
}

declare module '@mui/material/Fab' {
	interface FabPropsColorOverrides {
		accent: true;
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
			main: '#2a9d8f',
			light: '#54cebf',
			dark: '#006e62',
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
	},
};

const blueYellowTheme: ThemePalette = {
	id: 'blue-yellow',
	name: 'Blue Yellow',
	palette: {
		mode: 'dark',
		primary: {
			main: '#8ecae6', // Light blue
			light: '#b3e4f3', // Lighter blue
			dark: '#5b9db3', // Darker blue
			contrastText: '#000',
		},
		secondary: {
			main: '#219ebc', // Medium blue
			light: '#5ab8d1', // Lighter medium blue
			dark: '#176e83', // Darker medium blue
			contrastText: '#000',
		},
		accent: {
			main: '#023047', // Dark blue
			light: '#355a6b', // Lighter dark blue
			dark: '#011d2e', // Darker dark blue
			contrastText: '#000',
		},
		warning: {
			main: '#ffb703', // Yellow
			light: '#ffcb4d', // Lighter yellow
			dark: '#c68400', // Darker yellow
			contrastText: '#000000',
		},
		error: {
			main: '#fb8500', // Orange
			light: '#ff9e4d', // Lighter orange
			dark: '#c45c00', // Darker orange
			contrastText: '#ffffff',
		},
	},
};

const modernCalmTheme: ThemePalette = {
	id: 'modern-calm',
	name: 'Modern Calm',
	palette: {
		primary: {
			main: '#4a7c59', // Muted Green
			light: '#6fa97c', // Lighter Green
			dark: '#2f523b', // Darker Green
			contrastText: '#ffffff', // White text
		},
		secondary: {
			main: '#2b6777', // Deep Blue
			light: '#4d8ca0', // Lighter Blue
			dark: '#1a4550', // Darker Blue
			contrastText: '#ffffff', // White text
		},
		accent: {
			main: '#f4a261', // Soft Orange
			light: '#f7c08a', // Lighter Orange
			dark: '#c17a3e', // Darker Orange
			contrastText: '#ffffff', // White text
		},
		warning: {
			main: '#e9c46a', // Warm Yellow
			light: '#f3d89a', // Lighter Yellow
			dark: '#b89a4a', // Darker Yellow
			contrastText: '#000000', // Black text
		},
		error: {
			main: '#e76f51', // Coral Red
			light: '#f29b82', // Lighter Coral Red
			dark: '#b54a34', // Darker Coral Red
			contrastText: '#ffffff', // White text
		},
		success: {
			main: '#2a9d8f', // Teal Green
			light: '#5fc2b3', // Lighter Teal Green
			dark: '#1b6d63', // Darker Teal Green
			contrastText: '#ffffff', // White text
		},
		background: {
			default: '#f4f4f9', // Soft Neutral Background
			paper: '#ffffff', // White Paper Background
		},
		text: {
			primary: '#2d3748', // Dark Gray Text
			secondary: '#718096', // Medium Gray Text
			disabled: '#a0aec0', // Light Gray Text
		},
	},
};

export const themes: ThemePalette[] = [
	blueTealYellowTheme,
	blueYellowTheme,
	modernCalmTheme,
];
