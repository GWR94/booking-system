import { AnimateIn, SectionHeader } from '@ui';
import {
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	Avatar,
	Container,
	useTheme,
	Box,
} from '@mui/material';

const teamMembers = [
	{
		name: 'Michael Wright',
		position: 'Founder & Lead Instructor',
		bio: 'Former PGA professional with over 15 years of experience. Specializes in data-driven coaching using TrackMan analytics to build consistent, powerful swings.',
		image: 'https://randomuser.me/api/portraits/men/32.jpg',
	},
	{
		name: 'Sarah Johnson',
		position: 'Centre Manager',
		bio: 'Ensures seamless daily operations and exceptional member experiences. Sarah coordinates our competitive leagues and manages corporate events.',
		image: 'https://randomuser.me/api/portraits/women/49.jpg',
	},
	{
		name: 'David Chen',
		position: 'Senior PGA Coach',
		bio: 'Certified TrackMan Master specializing in swing biomechanics. David combines technical precision with approachable instruction to help players of all levels.',
		image: 'https://randomuser.me/api/portraits/men/4.jpg',
	},
];

const Team = () => {
	const theme = useTheme();
	return (
		<Box sx={{ py: 8 }}>
			<Container maxWidth="lg">
				<SectionHeader
					subtitle="EXPERTS"
					title="Meet Our Team"
					description="Our team brings together PGA-certified expertise and a genuine passion for hospitality. We're here to help you understand your game, improve your swing, and ensure every visit to The Short Grass is exceptional."
				/>

				<Grid
					container
					spacing={4}
					justifyContent="center"
					alignItems="stretch"
				>
					{teamMembers.map((member, index) => (
						<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
							<AnimateIn
								type="fade-up"
								delay={index * 0.2}
								style={{ height: '100%' }}
							>
								<Card
									elevation={0}
									sx={{
										height: '100%',
										border: `1px solid ${theme.palette.divider}`,
										borderRadius: 2,
										transition: 'all 0.3s ease',
										'&:hover': {
											boxShadow: 3,
											transform: 'translateY(-4px)',
											borderColor: theme.palette.primary.main,
										},
									}}
								>
									<CardContent sx={{ p: 4, textAlign: 'center' }}>
										<Avatar
											src={member.image}
											alt={member.name}
											sx={{
												width: 120,
												height: 120,
												mx: 'auto',
												mb: 3,
												border: `3px solid ${theme.palette.secondary.main}`,
												boxShadow: 2,
											}}
										/>
										<Typography
											variant="h5"
											component="h3"
											gutterBottom
											sx={{ fontWeight: 600 }}
										>
											{member.name}
										</Typography>
										<Typography
											variant="subtitle1"
											color="primary"
											gutterBottom
											sx={{ fontWeight: 600, mb: 2 }}
										>
											{member.position}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ lineHeight: 1.6 }}
										>
											{member.bio}
										</Typography>
									</CardContent>
								</Card>
							</AnimateIn>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default Team;
