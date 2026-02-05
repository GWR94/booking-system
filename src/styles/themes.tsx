import {
	Palette,
	PaletteColorOptions,
	ThemeOptions,
} from '@mui/material/styles';

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
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					fontWeight: 600,
				},
				contained: {
					boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
	},
};

const sapphireTheme: ThemePalette = {
	id: 'sapphire-night',
	name: 'Sapphire Night',
	palette: {
		primary: {
			main: '#0f172a', // Deep Slate Blue works well for headers/nav
			light: '#334155',
			dark: '#020617',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#3b82f6', // Bright Blue for primary actions
			light: '#60a5fa',
			dark: '#1d4ed8',
			contrastText: '#ffffff',
		},
		accent: {
			main: '#8b5cf6', // Violet for highlights
			light: '#a78bfa',
			dark: '#7c3aed',
			contrastText: '#ffffff',
		},
		warning: {
			main: '#f59e0b', // Amber
			light: '#fbbf24',
			dark: '#d97706',
			contrastText: '#000000',
		},
		error: {
			main: '#ef4444', // Red
			light: '#f87171',
			dark: '#b91c1c',
			contrastText: '#ffffff',
		},
		success: {
			main: '#10b981', // Emerald
			light: '#34d399',
			dark: '#059669',
			contrastText: '#ffffff',
		},
		link: {
			main: '#0ea5e9', // Sky
			light: '#38bdf8',
			dark: '#0284c7',
			contrastText: '#ffffff',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					fontWeight: 600,
				},
				contained: {
					boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
	},
};

const emeraldPrestigeTheme: ThemePalette = {
	id: 'emerald-prestige',
	name: 'Emerald Prestige',
	palette: {
		primary: {
			main: '#064e3b', // Deep Emerald Green
			light: '#059669',
			dark: '#022c22',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#d97706', // Rich Gold
			light: '#fbbf24',
			dark: '#b45309',
			contrastText: '#ffffff',
		},
		accent: {
			main: '#10b981', // Vivid Green for highlights
			light: '#34d399',
			dark: '#059669',
			contrastText: '#ffffff',
		},
		warning: {
			main: '#f59e0b',
			light: '#fbbf24',
			dark: '#d97706',
			contrastText: '#000000',
		},
		error: {
			main: '#ef4444',
			light: '#f87171',
			dark: '#b91c1c',
			contrastText: '#ffffff',
		},
		success: {
			main: '#22c55e',
			light: '#4ade80',
			dark: '#15803d',
			contrastText: '#ffffff',
		},
		link: {
			main: '#f59e0b', // Gold links
			light: '#fbbf24',
			dark: '#d97706',
			contrastText: '#000000',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					fontWeight: 600,
				},
				contained: {
					boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
	},
};

const midnightAmethystTheme: ThemePalette = {
	id: 'midnight-amethyst',
	name: 'Midnight Amethyst',
	palette: {
		primary: {
			main: '#3b0764', // Deepest Purple
			light: '#6b21a8',
			dark: '#2e0249',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#c026d3', // Fuschia
			light: '#e879f9',
			dark: '#a21caf',
			contrastText: '#ffffff',
		},
		accent: {
			main: '#f472b6', // Pink highlight
			light: '#fbcfe8',
			dark: '#db2777',
			contrastText: '#000000',
		},
		warning: {
			main: '#f97316',
			light: '#fdba74',
			dark: '#c2410c',
			contrastText: '#ffffff',
		},
		error: {
			main: '#ef4444',
			light: '#f87171',
			dark: '#b91c1c',
			contrastText: '#ffffff',
		},
		success: {
			main: '#10b981',
			light: '#34d399',
			dark: '#059669',
			contrastText: '#ffffff',
		},
		link: {
			main: '#e879f9',
			light: '#f0abfc',
			dark: '#c026d3',
			contrastText: '#000000',
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					fontWeight: 600,
				},
				contained: {
					boxShadow: '0 4px 14px 0 rgba(0,0,0,0.25)',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
			},
		},
	},
};

export const themes: ThemePalette[] = [
	blueTealYellowTheme,
	sapphireTheme,
	emeraldPrestigeTheme,
	midnightAmethystTheme,
];
