import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
	useMemo,
} from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

interface SnackbarContextType {
	showSnackbar: (message: string, severity?: AlertProps['severity']) => void;
	hideSnackbar: () => void;
	setBottomOffset: (offset: number) => void;
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(
	undefined,
);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [snackbar, setSnackbar] = useState<{
		message: string;
		severity: AlertProps['severity'];
		open: boolean;
		key: number;
	}>({
		message: '',
		severity: 'info',
		open: false,
		key: 0,
	});
	const [bottomOffset, setBottomOffset] = useState(0);

	const showSnackbar = useCallback(
		(message: string, severity: AlertProps['severity'] = 'info') => {
			setSnackbar({ message, severity, open: true, key: Date.now() });
		},
		[],
	);

	const hideSnackbar = useCallback(
		() => setSnackbar((prev) => ({ ...prev, open: false })),
		[],
	);

	const value: SnackbarContextType = useMemo(
		() => ({
			showSnackbar,
			hideSnackbar,
			setBottomOffset,
		}),
		[showSnackbar, hideSnackbar, setBottomOffset],
	);

	return (
		<SnackbarContext.Provider value={value}>
			{children}
			<Snackbar
				key={snackbar.key}
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={hideSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				sx={{ mb: bottomOffset }}
			>
				<Alert
					onClose={hideSnackbar}
					severity={snackbar.severity}
					sx={{ width: '100%', background: '#fff' }}
					variant="outlined"
				>
					{snackbar.message}
				</Alert>
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
