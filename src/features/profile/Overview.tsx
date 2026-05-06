'use client';

import { PendingPaymentBanner, UserProfile } from './components';
import { Box } from '@mui/material';
import { SectionHeader } from '@ui';
import { useAuth } from '@hooks';
import { getLatestResumablePendingBooking } from '@utils/pending-payment';

const Overview = () => {
	const { user } = useAuth();
	const pendingBooking = getLatestResumablePendingBooking(user?.bookings);

	return (
		<Box>
			<SectionHeader
				subtitle="PROFILE"
				title="Overview"
				description="View and edit your personal information"
			/>
			{pendingBooking && <PendingPaymentBanner bookingId={pendingBooking.id} />}
			<UserProfile />
		</Box>
	);
};

export default Overview;
