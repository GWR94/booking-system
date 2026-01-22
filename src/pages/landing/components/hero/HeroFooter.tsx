import { Box, Typography } from '@mui/material';

const HeroFooter = () => {
	return (
		<Box
			sx={{
				mt: { xs: 6, md: 10 },
				pt: 3,
				borderTop: '1px solid rgba(255,255,255,0.2)',
				display: 'flex',
				justifyContent: 'space-between',
				flexWrap: 'wrap',
				gap: 2,
			}}
		>
			<Typography variant="body2" sx={{ opacity: 0.7 }}>
				Located at: High St, Maidstone ME14 1JL, UK
			</Typography>
			<Typography variant="body2" sx={{ opacity: 0.7 }}>
				Open Mon-Sat | 10:00 AM - 10:00 PM
			</Typography>
			<Typography variant="body2" sx={{ opacity: 0.7 }}>
				+44 79874 45123
			</Typography>
		</Box>
	);
};

export default HeroFooter;
