import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { SlotsProvider } from './context/SlotContext';
import { SnackbarProvider } from './context/SnackbarContext';
import { BasketProvider } from './context/BasketContext';

const App = () => {
	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<SnackbarProvider>
				<BasketProvider>
					<AuthProvider>
						<SlotsProvider>
							<AppRouter />
						</SlotsProvider>
					</AuthProvider>
				</BasketProvider>
			</SnackbarProvider>
		</LocalizationProvider>
	);
};

export default App;
