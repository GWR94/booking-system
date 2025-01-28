import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { SnackbarProvider } from '../context/SnackbarContext';
import { SlotsProvider } from '../context/SlotContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<SnackbarProvider>
			<SlotsProvider>
				<AuthProvider>{children}</AuthProvider>
			</SlotsProvider>
		</SnackbarProvider>
	);
};

const customRender = (ui: React.ReactElement, options = {}) =>
	render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
