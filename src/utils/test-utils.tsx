import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import { SnackbarContext } from '../context/SnackbarContext';
import { vi } from 'vitest';

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const mockShowSnackbar = vi.fn();
	const mockHideSnackbar = vi.fn();
	const mockSetBottomOffset = vi.fn();

	const theme = createTheme();

	return ({ children }: { children: ReactNode }) => (
		<SessionProvider session={null}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<SnackbarContext.Provider
						value={{
							showSnackbar: mockShowSnackbar,
							hideSnackbar: mockHideSnackbar,
							setBottomOffset: mockSetBottomOffset,
						}}
					>
						{children}
					</SnackbarContext.Provider>
				</ThemeProvider>
			</QueryClientProvider>
		</SessionProvider>
	);
};

export default createWrapper;
