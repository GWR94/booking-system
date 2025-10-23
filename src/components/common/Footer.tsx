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
	GolfCourse,
	Email,
	Phone,
	LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
	const theme = useTheme();
	const currentYear = new Date().getFullYear();

	return (
		<Box
			sx={{
				borderTop: `1px solid ${theme.palette.divider}`,
				backgroundColor: theme.palette.primary.main,
				color: theme.palette.primary.contrastText,
				py: 6,
				mt: 'auto', // This pushes the footer to the bottom if the page content is short
			}}
		>
			<Container maxWidth="xl">
				<Grid container spacing={4}>
					{/* Logo and Description */}
					<Grid size={{ xs: 12, md: 4 }}>
						<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
							<GolfCourse sx={{ mr: 1, fontSize: '2rem' }} />
							<Typography
								variant="h6"
								component={RouterLink}
								to="/"
								sx={{
									fontFamily: 'monospace',
									fontWeight: 700,
									letterSpacing: '.3rem',
									color: 'inherit',
									textDecoration: 'none',
								}}
							>
								[GWR-GLF]
							</Typography>
						</Box>
						<Typography variant="body2" sx={{ mb: 2, pr: 2 }}>
							Improve your golf game in our state-of-the-art simulator facility.
							Three private Trackman booths await to elevate your golfing
							experience.
						</Typography>
						<Box>
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
								aria-label="Twitter"
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
								<YouTube />
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
					<Grid size={{ xs: 12, md: 2 }}>
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
							<Typography variant="body2">+44 79874 45123</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Email sx={{ mr: 1, color: theme.palette.error.dark }} />
							<Typography variant="body2">info@gwrgolf.com</Typography>
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
						© {currentYear} GWR Golf Simulators. All rights reserved.
					</Typography>
					<Box sx={{ display: 'flex', gap: 2 }}>
						<Link
							component={RouterLink}
							to="/terms"
							color="inherit"
							underline="hover"
							variant="body2"
						>
							Terms
						</Link>
						<Link
							component={RouterLink}
							to="/privacy"
							color="inherit"
							underline="hover"
							variant="body2"
						>
							Privacy
						</Link>
						<Link
							component={RouterLink}
							to="/cookies"
							color="inherit"
							underline="hover"
							variant="body2"
						>
							Cookies
						</Link>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
