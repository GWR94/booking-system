import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@context/ThemeContext';
import { UIProvider, CookieProvider, SnackbarProvider } from '@context';
import { AuthModal } from './pages/auth/components';
import { CssBaseline } from '@mui/material';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	},
});

const App = () => (
	<Router
		future={{
			v7_startTransition: true,
			v7_relativeSplatPath: true,
		}}
	>
		<ThemeProvider>
			<CssBaseline />
			<QueryClientProvider client={queryClient}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<CookieProvider>
						<SnackbarProvider>
							<UIProvider>
								<AuthModal />
								<AppRouter />
							</UIProvider>
							<ReactQueryDevtools initialIsOpen={false} />
						</SnackbarProvider>
					</CookieProvider>
				</LocalizationProvider>
			</QueryClientProvider>
		</ThemeProvider>
	</Router>
);

export default App;
