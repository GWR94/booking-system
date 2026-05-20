import Link from 'next/link';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { supportFaqsHref } from '@features/help-center/supportSections';

const MembershipFAQ = () => {
	const theme = useTheme();

	return (
		<Box
			component="section"
			aria-labelledby="membership-faq-heading"
			sx={{
				mb: 8,
				maxWidth: 'min(42rem, 100%)',
				mx: 'auto',
				px: { xs: 0, sm: 1 },
				textAlign: 'center',
			}}
		>
			<Typography
				variant="overline"
				sx={{
					color: 'primary.main',
					fontWeight: 700,
					letterSpacing: 2,
					mb: 1,
					display: 'block',
				}}
			>
				FAQ
			</Typography>
			<Typography
				id="membership-faq-heading"
				variant="h4"
				component="h2"
				sx={{
					fontWeight: 700,
					mb: 2,
					letterSpacing: '-0.02em',
				}}
			>
				Membership questions?
			</Typography>
			<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
				Plans, billing, and perks are covered in our help center.
			</Typography>
			<Button
				component={Link}
				href={supportFaqsHref('membership')}
				variant="outlined"
				color="primary"
				sx={{
					borderColor: theme.palette.divider,
					fontWeight: 600,
				}}
			>
				View membership FAQs
			</Button>
		</Box>
	);
};

export default MembershipFAQ;
