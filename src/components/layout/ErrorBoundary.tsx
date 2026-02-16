'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	private handleReload = () => {
		window.location.reload();
	};

	public render() {
		if (this.state.hasError) {
			return (
				<Container maxWidth="md">
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							minHeight: '100vh',
							textAlign: 'center',
							py: 4,
						}}
					>
						<Typography variant="h2" component="h1" gutterBottom color="error">
							Something went wrong
						</Typography>
						<Typography variant="h5" color="text.secondary">
							We apologize for the inconvenience. An unexpected error has
							occurred.
						</Typography>
						{process.env.NODE_ENV === 'development' && this.state.error && (
							<Box
								component="pre"
								sx={{
									p: 2,
									bgcolor: 'grey.100',
									borderRadius: 1,
									overflow: 'auto',
									maxWidth: '100%',
									my: 2,
									textAlign: 'left',
								}}
							>
								<code>{this.state.error.toString()}</code>
							</Box>
						)}
						<Button
							variant="contained"
							startIcon={<RefreshIcon />}
							onClick={this.handleReload}
							sx={{ mt: 3 }}
						>
							Reload Page
						</Button>
					</Box>
				</Container>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
