import COMPANY_INFO from '@/constants/company';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';

function FindOurLocation() {
	const theme = useTheme();

	return (
		<Box>
			<Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
				Find our location
			</Typography>
			<Box
				sx={{
					width: '100%',
					height: 400,
					borderRadius: 2,
					overflow: 'hidden',
				}}
			>
				<iframe
					src={COMPANY_INFO.googleMapsEmbedUrl}
					width="100%"
					height="100%"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					title={`${COMPANY_INFO.name} Location`}
				/>
			</Box>
		</Box>
	);
}

export default FindOurLocation;
