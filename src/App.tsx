import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { SlotsProvider } from './context/SlotContext';
import { SnackbarProvider } from './context/SnackbarContext';

const App = () => {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<SnackbarProvider>
				<AuthProvider>
					<SlotsProvider>
						<AppRouter />
					</SlotsProvider>
				</AuthProvider>
			</SnackbarProvider>
		</LocalizationProvider>
	);
};

export default App;
