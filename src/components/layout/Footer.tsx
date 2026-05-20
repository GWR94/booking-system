'use client';

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
	Instagram,
	X,
	Phone,
	LocationOn,
	AlternateEmail,
} from '@mui/icons-material';
import { Logo } from '@ui';
import COMPANY_INFO, {
	companyAddressMaps,
	companyEmailMailto,
	companyPhoneTel,
} from '@constants/company';
import CompanyAddressText from '@/components/shared/CompanyAddressText';
import { supportSectionHref } from '@features/help-center/supportSections';
import NextLink from 'next/link';
import SocialMediaIcons from '../shared/SocialMediaIcons';
import { alpha } from '@mui/system';

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
						size={{ xs: 12, sm: 4 }}
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
						<SocialMediaIcons />
					</Grid>

					<Grid
						size={{
							xs: 12,
							sm: 3,
						}}
						sx={{
							fontSize: '0.875rem',
							color: alpha(theme.palette.primary.contrastText, 0.7),
						}}
					>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}
						>
							Support
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<Link
								component={NextLink}
								href={supportSectionHref('faqs')}
								color="inherit"
								underline="hover"
							>
								FAQs
							</Link>
							<Link
								component={NextLink}
								href={supportSectionHref('terms')}
								color="inherit"
								underline="hover"
							>
								Terms & Conditions
							</Link>
							<Link
								component={NextLink}
								href={supportSectionHref('privacy')}
								color="inherit"
								underline="hover"
							>
								Privacy Policy
							</Link>
							<Link
								component={NextLink}
								href={supportSectionHref('cookies')}
								color="inherit"
								underline="hover"
							>
								Cookies Policy
							</Link>
						</Box>
					</Grid>
					<Grid
						size={{ xs: 12, sm: 5 }}
						sx={{
							fontSize: '0.875rem',
							color: alpha(theme.palette.primary.contrastText, 0.7),
						}}
					>
						<Typography
							variant="h6"
							gutterBottom
							sx={{ fontWeight: 'bold', color: theme.palette.secondary.light }}
						>
							Contact Us
						</Typography>
						<Link
							component="a"
							href={companyAddressMaps}
							target="_blank"
							rel="noopener noreferrer"
							color="inherit"
							underline="hover"
							aria-label={`Open ${COMPANY_INFO.address} in Google Maps`}
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: 1,
								mb: 1,
								alignItems: 'flex-start',
							}}
						>
							<LocationOn
								sx={{
									color: theme.palette.accent.main,
									flexShrink: 0,
								}}
							/>
							<CompanyAddressText />
						</Link>
						<Link
							component="a"
							href={companyPhoneTel}
							color="inherit"
							underline="hover"
							aria-label={`Call ${COMPANY_INFO.phone}`}
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: 1,
								mb: 1,
								alignItems: 'center',
							}}
						>
							<Phone
								sx={{
									color: theme.palette.accent.main,
									flexShrink: 0,
								}}
							/>
							{COMPANY_INFO.phone}
						</Link>
						<Link
							component="a"
							href={companyEmailMailto}
							color="inherit"
							underline="hover"
							aria-label={`Email ${COMPANY_INFO.email}`}
							sx={{
								display: 'flex',
								flexDirection: 'row',
								gap: 1,
								alignItems: 'center',
							}}
						>
							<AlternateEmail
								sx={{
									color: theme.palette.accent.main,
									flexShrink: 0,
								}}
							/>
							{COMPANY_INFO.email}
						</Link>
					</Grid>
				</Grid>

				{/* Copyright */}
				<Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Box
						component={NextLink}
						href="https://www.jamesgower.dev"
						sx={{
							textDecoration: 'none',
							'&:hover': { textDecoration: 'underline' },
							textAlign: 'right',
							fontSize: '0.875rem',
							color: alpha(theme.palette.primary.contrastText, 0.5),
							mb: { xs: 2, sm: 0 },
						}}
					>
						© James Gower {new Date().getFullYear()}
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
