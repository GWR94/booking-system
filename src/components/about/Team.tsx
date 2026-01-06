import { AnimateIn } from '@common';
import {
	Typography,
	Grid2 as Grid,
	Card,
	CardContent,
	Avatar,
	Container,
	useTheme,
} from '@mui/material';

// Team member data
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
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<AnimateIn type="fade-down">
				<Typography
					variant="title"
					gutterBottom
					sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 4 }}
				>
					Meet Our Experts
				</Typography>
				<Typography
					variant="body1"
					color="text.secondary"
					align="center"
					sx={{ mb: 5, maxWidth: 700, mx: 'auto' }}
				>
					Our team combines PGA-certified expertise with cutting-edge simulator
					technology. We are dedicated to providing a premium experience and
					helping you master your game through data and verified technique.
				</Typography>
			</AnimateIn>

			<Grid container spacing={4} justifyContent="center">
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
										transform: 'translateY(-5px)',
									},
								}}
							>
								<CardContent sx={{ p: 3 }}>
									<Avatar
										src={member.image}
										alt={member.name}
										sx={{
											width: 120,
											height: 120,
											mx: 'auto',
											mb: 2,
											border: `3px solid ${theme.palette.secondary.main}`,
										}}
									/>
									<Typography variant="h6" component="h3" gutterBottom>
										{member.name}
									</Typography>
									<Typography
										variant="subtitle1"
										color="primary"
										gutterBottom
										sx={{ fontWeight: 500 }}
									>
										{member.position}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{member.bio}
									</Typography>
								</CardContent>
							</Card>
						</AnimateIn>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Team;
