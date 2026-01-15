import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarContext } from '@context';
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

	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<SnackbarContext.Provider
				value={{
					showSnackbar: mockShowSnackbar,
					hideSnackbar: mockHideSnackbar,
				}}
			>
				{children}
			</SnackbarContext.Provider>
		</QueryClientProvider>
	);
};

export default createWrapper;
