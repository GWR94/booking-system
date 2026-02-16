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
	alpha,
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

	const cardStyles = {
		height: '100%',
		borderRadius: 4,
		// Glassmorphism
		background: alpha(theme.palette.background.paper, 0.7),
		backdropFilter: 'blur(12px)',
		border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		overflow: 'hidden',
		position: 'relative',
		'&:hover': {
			transform: 'translateY(-8px)',
			boxShadow: `0 12px 24px -10px ${alpha(theme.palette.primary.main, 0.3)}`,
		},
		'&::after': {
			content: '""',
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			height: '0px',
			background: theme.palette.secondary.main, // Solid accent color
			transition: 'height 0.3s ease',
		},
		'&:hover::after': {
			height: '4px',
		},
	};

	return (
		<Box
			sx={{
				py: 10,
				background: `linear-gradient(180deg, ${theme.palette.grey[100]} 0%, ${theme.palette.common.white} 100%)`,
				position: 'relative',
			}}
		>
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
								<Card elevation={0} sx={cardStyles}>
									<CardContent
										sx={{
											p: 4,
											textAlign: 'center',
											position: 'relative',
											zIndex: 1,
										}}
									>
										<Box
											sx={{
												position: 'relative',
												display: 'inline-block',
												mb: 3,
											}}
										>
											<Box
												sx={{
													position: 'absolute',
													inset: -4,
													borderRadius: '50%',
													background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
													opacity: 0.8,
													filter: 'blur(8px)',
												}}
											/>
											<Avatar
												src={member.image}
												alt={member.name}
												sx={{
													width: 120,
													height: 120,
													border: `3px solid ${theme.palette.background.paper}`,
													boxShadow: 3,
													position: 'relative',
												}}
											/>
										</Box>

										<Typography
											variant="h5"
											component="h3"
											gutterBottom
											sx={{ fontWeight: 800 }}
										>
											{member.name}
										</Typography>
										<Typography
											variant="subtitle1"
											color="secondary"
											gutterBottom
											sx={{
												fontWeight: 700,
												mb: 2,
												display: 'inline-block',
											}}
										>
											{member.position}
										</Typography>
										<Typography
											variant="body1"
											color="text.secondary"
											sx={{
												lineHeight: 1.7,
												color: alpha(theme.palette.text.primary, 0.7),
											}}
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
