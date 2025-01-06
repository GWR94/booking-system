import React, { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface SnackbarContextType {
	showSnackbar: (message: string, severity?: AlertProps['severity']) => void;
	hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
	undefined,
);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [snackbar, setSnackbar] = useState<{
		message: string;
		severity: AlertProps['severity'];
		open: boolean;
	}>({
		message: '',
		severity: 'info',
		open: false,
	});

	const showSnackbar = (
		message: string,
		severity: AlertProps['severity'] = 'info',
	) => {
		setSnackbar({ message, severity, open: true });
	};

	const hideSnackbar = () =>
		setSnackbar({ message: '', severity: 'info', open: false });

	const value: SnackbarContextType = {
		showSnackbar,
		hideSnackbar,
	};

	return (
		<SnackbarContext.Provider value={value}>
			{children}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={hideSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<MuiAlert
					onClose={hideSnackbar}
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</MuiAlert>
			</Snackbar>
		</SnackbarContext.Provider>
	);
};

export const useSnackbar = (): SnackbarContextType => {
	const context = useContext(SnackbarContext);
	if (!context) {
		throw new Error('useSnackbar must be used within a SnackbarProvider');
	}
	return context;
};
