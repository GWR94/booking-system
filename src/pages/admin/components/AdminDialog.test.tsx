import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AdminDialog from './AdminDialog';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

describe('AdminDialog', () => {
	const defaultProps = {
		open: true,
		onClose: vi.fn(),
		title: 'Test Title',
		description: 'Test Description',
	};

	it('should render title and description', () => {
		render(
			<ThemeProvider theme={theme}>
				<AdminDialog {...defaultProps} />
			</ThemeProvider>,
		);

		expect(screen.getByText('Test Title')).toBeInTheDocument();
		expect(screen.getByText('Test Description')).toBeInTheDocument();
	});

	it('should call onClose when OK is clicked', () => {
		render(
			<ThemeProvider theme={theme}>
				<AdminDialog {...defaultProps} />
			</ThemeProvider>,
		);

		fireEvent.click(screen.getByText('OK'));
		expect(defaultProps.onClose).toHaveBeenCalled();
	});

	it('should render cancel button and call onConfirm when type is confirm', () => {
		const onConfirm = vi.fn();
		render(
			<ThemeProvider theme={theme}>
				<AdminDialog
					{...defaultProps}
					type="confirm"
					onConfirm={onConfirm}
					confirmLabel="Yes"
					cancelLabel="No"
				/>
			</ThemeProvider>,
		);

		expect(screen.getByText('No')).toBeInTheDocument();
		fireEvent.click(screen.getByText('Yes'));
		expect(onConfirm).toHaveBeenCalled();
	});
});
