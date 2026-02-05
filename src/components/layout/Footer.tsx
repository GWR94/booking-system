import React from 'react';
import {
	Box,
	Container,
	Grid2 as Grid,
	Typography,
	Link,
	IconButton,
	Divider,
	useTheme,
} from '@mui/material';
import {
	Facebook,
	Twitter,
	Instagram,
	X,
	Email,
	Phone,
	LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { Logo } from '@ui';
import { COMPANY_INFO } from '@constants/company';

const Footer: React.FC = () => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				borderTop: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.primary.contrastText,
				py: 6,
				mt: 'auto',
			}}
		>
			<Container>
				<Grid container spacing={2}>
					<Grid
						size={{ xs: 12, md: 4 }}
						sx={{
							px: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								mb: 1,
								height: 60,
								justifyContent: 'center',
							}}
						>
							<Logo />
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<IconButton
								color="inherit"
								aria-label="Facebook"
								sx={{
									color: theme.palette.accent.main,
									'&:hover': {
										backgroundColor: theme.palette.primary.dark,
									},
								}}
							>
								<Facebook />
							</IconButton>
							<IconButton
								color="inherit"
								aria-label="X | Twitter"
								sx={{
									color: theme.palette.accent.main,

									'&:hover': {
										backgroundColor: theme.palette.primary.dark,
									},
								}}
							>
								<Twitter />
							</IconButton>
							<IconButton
								color="inherit"
								aria-label="Instagram"
								sx={{
									color: theme.palette.accent.main,
									'&:hover': {
										backgroundColor: theme.palette.primary.dark,
									},
								}}
							>
								<Instagram />
							</IconButton>
							<IconButton
								aria-label="YouTube"
								sx={{
									color: theme.palette.accent.main,
									'&:hover': {
										backgroundColor: theme.palette.primary.dark,
									},
								}}
							>
								<X />
							</IconButton>
						</Box>
					</Grid>
					<Grid size={{ xs: 6, md: 2 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{
								fontWeight: 600,
								color: theme.palette.secondary.light,
								opacity: 0.9,
							}}
						>
							Links
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Link
								component={RouterLink}
								to="/"
								color="inherit"
								underline="hover"
								sx={{ mb: 1, opacity: 0.85, '&:hover': { opacity: 1 } }}
							>
								Home
							</Link>
							<Link
								component={RouterLink}
								to="/about"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
							>
								About Us
							</Link>
							<Link
								component={RouterLink}
								to="/book"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
							>
								Bookings
							</Link>
							<Link
								component={RouterLink}
								to="/membership"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
							>
								Membership
							</Link>
						</Box>
					</Grid>
					<Grid size={{ xs: 6, md: 2 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}
						>
							Support
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<Link
								component={RouterLink}
								to="/terms"
								color="inherit"
								underline="hover"
								sx={{ opacity: 0.85, '&:hover': { opacity: 1 } }}
							>
								Terms & Conditions
							</Link>
							<Link
								component={RouterLink}
								to="/privacy"
								color="inherit"
								underline="hover"
							>
								Privacy Policy
							</Link>
							<Link
								component={RouterLink}
								to="/help"
								color="inherit"
								underline="hover"
							>
								Help Center
							</Link>
							<Link
								component={RouterLink}
								to="/cookies"
								color="inherit"
								underline="hover"
							>
								Cookies Policy
							</Link>
						</Box>
					</Grid>
					<Grid size={{ xs: 12, md: 3 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}
						>
							Contact Us
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<LocationOn
								sx={{ mr: 1, color: theme.palette.error.light, opacity: 0.85 }}
							/>
							<Typography variant="body2" sx={{ opacity: 0.85 }}>
								{COMPANY_INFO.address}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<Phone
								sx={{ mr: 1, color: theme.palette.error.main, opacity: 0.85 }}
							/>
							<Typography variant="body2" sx={{ opacity: 0.85 }}>
								{COMPANY_INFO.phone}
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Email
								sx={{ mr: 1, color: theme.palette.error.dark, opacity: 0.85 }}
							/>
							<Typography variant="body2">
								<Box
									component="a"
									href={`mailto:${COMPANY_INFO.email}`}
									sx={{
										color: '#fff',
										textDecoration: 'none',
										opacity: 0.85,
										'&:hover': {
											textDecoration: 'underline',
											opacity: 1,
										},
									}}
								>
									{COMPANY_INFO.email}
								</Box>
							</Typography>
						</Box>
					</Grid>
				</Grid>

				{/* Copyright */}
				<Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
					}}
				>
					<Typography
						variant="body2"
						sx={{ color: theme.palette.grey[500], mb: { xs: 2, sm: 0 } }}
					>
						© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights
						reserved.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
