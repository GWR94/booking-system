'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@context/ThemeContext';
import { UIProvider, CookieProvider, SnackbarProvider } from '@context';
import { CssBaseline } from '@mui/material';
import { ErrorBoundary } from '@layout';
import { AuthModal } from '@features/auth/components';

export default function Providers({ children }: PropsWithChildren) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
					},
				},
			}),
	);

	return (
		<SessionProvider>
			<ThemeProvider>
				<CssBaseline />
				<QueryClientProvider client={queryClient}>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<CookieProvider>
							<SnackbarProvider>
								<ErrorBoundary>
									<UIProvider>
										{children}
										<AuthModal />
									</UIProvider>
								</ErrorBoundary>
							</SnackbarProvider>
						</CookieProvider>
					</LocalizationProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}
