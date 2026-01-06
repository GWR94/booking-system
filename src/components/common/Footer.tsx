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
	YouTube,
	X,
	GolfCourse,
	Email,
	Phone,
	LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';

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
					{/* Logo and Description */}
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

					{/* Quick Links */}
					<Grid size={{ xs: 6, md: 2 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}
						>
							Links
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Link
								component={RouterLink}
								to="/"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
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
								Book Now
							</Link>
							<Link
								component={RouterLink}
								to="/contact"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
							>
								Contact
							</Link>
						</Box>
					</Grid>

					{/* Support */}
					<Grid size={{ xs: 6, md: 2 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}
						>
							Support
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column' }}>
							<Link
								component={RouterLink}
								to="/terms"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
							>
								Terms & Conditions
							</Link>
							<Link
								component={RouterLink}
								to="/privacy"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
							>
								Privacy Policy
							</Link>
							<Link
								component={RouterLink}
								to="/help"
								color="inherit"
								underline="hover"
								sx={{ mb: 1 }}
							>
								Help Center
							</Link>
						</Box>
					</Grid>

					{/* Contact */}
					<Grid size={{ xs: 12, md: 3 }}>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}
						>
							Contact Us
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<LocationOn sx={{ mr: 1, color: theme.palette.error.light }} />
							<Typography variant="body2">
								Royal Star Arcade, High St, Maidstone ME14 1JL
							</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
							<Phone sx={{ mr: 1, color: theme.palette.error.main }} />
							<Typography variant="body2">+44 79864 45123</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Email sx={{ mr: 1, color: theme.palette.error.dark }} />
							<Typography variant="body2">
								<Box
									component="a"
									href="mailto:info@gwrgolf.com"
									sx={{
										color: '#fff',
										textDecoration: 'none',
										'&:hover': {
											textDecoration: 'underline',
										},
									}}
								>
									info@gwrgolf.com
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
						© {new Date().getFullYear()} GWR Golf Simulators. All rights
						reserved.
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
