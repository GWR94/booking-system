'use client';

'use client';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from '@mui/material';

type AdminDialogProps = {
	open: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	title: string;
	description: string;
	type?: 'success' | 'error' | 'confirm' | 'info';
	confirmLabel?: string;
	cancelLabel?: string;
};

const AdminDialog = ({
	open,
	onClose,
	onConfirm,
	title,
	description,
	type = 'info',
	confirmLabel = 'OK',
	cancelLabel = 'Cancel',
}: AdminDialogProps) => {
	const isConfirm = type === 'confirm';

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<Typography>{description}</Typography>
			</DialogContent>
			<DialogActions>
				{isConfirm && <Button onClick={onClose}>{cancelLabel}</Button>}
				<Button
					onClick={onConfirm || onClose}
					variant="contained"
					color={
						type === 'error'
							? 'error'
							: type === 'confirm'
								? 'error'
								: 'primary'
					}
				>
					{isConfirm ? confirmLabel : 'OK'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AdminDialog;
