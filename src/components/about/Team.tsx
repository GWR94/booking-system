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
		position: 'Founder & CEO',
		bio: 'Former PGA professional with over 15 years of coaching experience.',
		image: 'https://randomuser.me/api/portraits/men/32.jpg',
	},
	{
		name: 'Sarah Johnson',
		position: 'Operations Manager',
		bio: 'Event management specialist with a passion for creating memorable experiences.',
		image: 'https://randomuser.me/api/portraits/women/44.jpg',
	},
	{
		name: 'David Chen',
		position: 'Head Golf Professional',
		bio: 'Certified instructor specializing in swing analysis and improvement techniques.',
		image: 'https://randomuser.me/api/portraits/men/68.jpg',
	},
];

const Team = () => {
	const theme = useTheme();
	return (
		<Container maxWidth="lg" sx={{ py: 6 }}>
			<Typography
				variant="h4"
				component="h2"
				align="center"
				gutterBottom
				sx={{ color: theme.palette.primary.main, fontWeight: 600, mb: 1 }}
			>
				Meet Our Team
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				align="center"
				sx={{ mb: 5, maxWidth: 700, mx: 'auto' }}
			>
				Our experienced staff is dedicated to providing an exceptional
				experience and helping you improve your game.
			</Typography>

			<Grid container spacing={4}>
				{teamMembers.map((member, index) => (
					<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
						<Card
							elevation={0}
							sx={{
								textAlign: 'center',
								height: '100%',
								border: `1px solid ${theme.palette.divider}`,
								borderRadius: 2,
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
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Team;
