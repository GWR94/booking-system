import React, { createContext, useState, useContext, ReactNode } from 'react';
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
	Theme,
} from '@mui/material';
import { themes } from '../styles/themes';

interface ThemeContextType {
	currentTheme: Theme;
	changeTheme: (themeId: string) => void;
	availableThemes: typeof themes;
	darkMode: boolean;
	toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}
	return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [themeId, setThemeId] = useState('blue-yellow-teal');
	const [darkMode, setDarkMode] = useState(false);

	const currentTheme =
		themes.find((theme) => theme.id === themeId) || themes[0];

	const theme = createTheme({
		palette: {
			...currentTheme.palette,
		},
		typography: {
			fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
			h1: {
				fontSize: '2.5rem',
				fontWeight: 500,
			},
		},
	});

	const changeTheme = (id: string) => setThemeId(id);
	const toggleDarkMode = () => setDarkMode((prev) => !prev);

	return (
		<ThemeContext.Provider
			value={{
				currentTheme: theme,
				changeTheme,
				availableThemes: themes,
				darkMode,
				toggleDarkMode,
			}}
		>
			<MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};
