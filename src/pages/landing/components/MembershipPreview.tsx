import { useNavigate } from 'react-router-dom';
import { AnimateIn, SectionHeader } from '@ui';
import {
	Card,
	CardContent,
	Typography,
	Grid2 as Grid,
	Container,
	Box,
	Button,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	useTheme,
	Chip,
	alpha,
} from '@mui/material';
import { Check, Star } from '@mui/icons-material';
import memberships from '@constants/memberships';

const MembershipPreview = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	const cardStyles = {
		p: 3,
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
		borderRadius: 4,
		border: '1px solid',
		bgcolor: 'background.paper',
		transition: 'all 0.3s ease',
		'&:hover': {
			transform: 'translateY(-8px)',
		},
	};

	return (
		<Box sx={{ py: 8, bgcolor: 'grey.50' }}>
			<Container maxWidth="lg">
				<SectionHeader
					subtitle="MEMBERSHIP"
					title="Flexible Membership Plans"
					description="Join The Short Grass community and enjoy exclusive benefits, priority access, and unlimited improvement for your game."
				/>

				<Grid
					container
					spacing={4}
					alignItems="stretch"
					justifyContent="center"
				>
					{memberships.map((tier, index) => (
						<Grid key={tier.title} size={{ xs: 12, md: 4 }}>
							<AnimateIn
								type="fade-up"
								delay={index * 0.1}
								style={{ height: '100%' }}
							>
								<Card
									elevation={0}
									sx={{
										...cardStyles,
										borderColor: tier.recommended
											? 'primary.main'
											: theme.palette.divider,
										boxShadow: tier.recommended
											? `0 8px 40px ${alpha(theme.palette.primary.main, 0.12)}`
											: '0 4px 20px rgba(0,0,0,0.04)',
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-8px)',
											boxShadow: tier.recommended
												? `0 12px 48px ${alpha(theme.palette.primary.main, 0.2)}`
												: '0 8px 30px rgba(0,0,0,0.08)',
										},
									}}
								>
									{tier.recommended && (
										<Chip
											label="Most Popular"
											color="secondary"
											size="small"
											icon={<Star fontSize="small" />}
											sx={{
												position: 'absolute',
												top: 16,
												right: 16,
												fontWeight: 600,
											}}
										/>
									)}
									<CardContent sx={{ flexGrow: 1 }}>
										<Typography
											variant="h5"
											component="h3"
											gutterBottom
											sx={{ fontWeight: 700 }}
										>
											{tier.title}
										</Typography>
										<Box
											sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}
										>
											<Typography
												variant="h3"
												component="span"
												color="primary"
												sx={{ fontWeight: 800 }}
											>
												{tier.price}
											</Typography>
											<Typography variant="subtitle1" color="text.secondary">
												{tier.period}
											</Typography>
										</Box>
										<List sx={{ mb: 2 }}>
											{tier.features.map((feature) => (
												<ListItem key={feature} disableGutters sx={{ py: 0.5 }}>
													<ListItemIcon sx={{ minWidth: 32 }}>
														<Check color="secondary" fontSize="small" />
													</ListItemIcon>
													<ListItemText
														primary={feature}
														primaryTypographyProps={{
															variant: 'body2',
														}}
													/>
												</ListItem>
											))}
										</List>
									</CardContent>
									<Box sx={{ p: 2, pt: 0 }}>
										<Button
											variant={tier.recommended ? 'contained' : 'outlined'}
											fullWidth
											color="primary"
											size="large"
											sx={{ borderRadius: 3, py: 1.5 }}
											onClick={() => navigate('/membership')}
										>
											Choose {tier.title}
										</Button>
									</Box>
								</Card>
							</AnimateIn>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default MembershipPreview;
