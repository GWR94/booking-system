import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookieProvider, SnackbarProvider } from '@context';
import { ThemeProvider } from '@context/ThemeContext';

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	const queryClient = createTestQueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<CookieProvider>
					<SnackbarProvider>{children}</SnackbarProvider>
				</CookieProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
};

const customRender = (ui: React.ReactElement, options = {}) =>
	render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
