import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarContext } from '../context/SnackbarContext';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { HelmetProvider } from 'react-helmet-async';

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

	return ({ children }: { children: ReactNode }) => (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<SnackbarContext.Provider
					value={{
						showSnackbar: mockShowSnackbar,
						hideSnackbar: mockHideSnackbar,
						setBottomOffset: mockSetBottomOffset,
					}}
				>
					<MemoryRouter>{children}</MemoryRouter>
				</SnackbarContext.Provider>
			</QueryClientProvider>
		</HelmetProvider>
	);
};

export default createWrapper;
