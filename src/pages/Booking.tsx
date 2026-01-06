import { Box, Container, Typography } from '@mui/material';
import GenerateSlots from '@components/booking/GenerateSlots';
import SessionPicker from '@components/booking/SessionPicker';
import NextPreviousButtons from '@components/booking/NextPreviousButtons';
import { LoadingSpinner } from '@common';
import { useSlots } from '@hooks';

const Booking = () => {
	const { isLoading } = useSlots();

	/**
	 * FIXME - when there is slots in the basket and the user logs in,
	 * the slots disappear
	 */

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: (theme) =>
					`linear-gradient(to bottom, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[300]} 100%)`,
				pt: 4,
			}}
		>
			<Container maxWidth="xl">
				<Box sx={{ mb: 4, textAlign: 'center' }}>
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						sx={{
							fontWeight: 800,
							background: (theme) =>
								`linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
							backgroundClip: 'text',
							textFillColor: 'transparent',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						Book Your Session
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Choose your preferred time and bay to get started
					</Typography>
				</Box>

				<SessionPicker />

				<Box sx={{ mt: 4 }}>
					{isLoading ? (
						<LoadingSpinner sx={{ height: '200px' }} />
					) : (
						<>
							<GenerateSlots />
							<NextPreviousButtons />
						</>
					)}
				</Box>
			</Container>
		</Box>
	);
};

export default Booking;
