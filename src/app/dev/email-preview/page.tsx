'use client';

import { useState } from 'react';
import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';

const TEMPLATES = [
	{ value: 'confirmation', label: 'Booking confirmation' },
	{ value: 'password-reset', label: 'Password reset' },
	{ value: 'contact-form', label: 'Contact form (admin)' },
] as const;

const EmailPreviewPage = () => {
	const [template, setTemplate] = useState<string>('confirmation');
	const [key, setKey] = useState(0);

	const handleChange = (e: SelectChangeEvent<string>) => {
		setTemplate(e.target.value);
		setKey((k) => k + 1);
	};

	const previewUrl = `/api/dev/email-preview?template=${template}`;

	return (
		<Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
			<Typography variant="h5" gutterBottom>
				Email template preview
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				Dummy data only. Open the link in a new tab to view full email.
			</Typography>
			<FormControl size="small" sx={{ minWidth: 220, mb: 2 }}>
				<InputLabel>Template</InputLabel>
				<Select value={template} label="Template" onChange={handleChange}>
					{TEMPLATES.map((t) => (
						<MenuItem key={t.value} value={t.value}>
							{t.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Box
				component="iframe"
				key={key}
				src={previewUrl}
				title="Email preview"
				sx={{
					width: '100%',
					height: 700,
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 1,
					bgcolor: '#f5f5f5',
				}}
			/>
		</Box>
	);
};
export default EmailPreviewPage;
