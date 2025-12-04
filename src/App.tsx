import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppRouter from './router/AppRouter';
import { SnackbarProvider } from './context/SnackbarContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from './context/ThemeContext';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false,
		},
	},
});

const App = () => (
	<ThemeProvider>
		<CssBaseline />
		<QueryClientProvider client={queryClient}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<SnackbarProvider>
					<AppRouter />
					<ReactQueryDevtools initialIsOpen={false} />
				</SnackbarProvider>
			</LocalizationProvider>
		</QueryClientProvider>
	</ThemeProvider>
);

export default App;
