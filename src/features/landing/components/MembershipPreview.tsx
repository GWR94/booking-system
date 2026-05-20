'use client';

import { useRouter } from 'next/navigation';
import { SectionHeader } from '@ui';
import { Container, Box, useTheme } from '@mui/material';
import { MembershipTiers } from '@/features/membership/components';

const MembershipPreview = () => {
	const theme = useTheme();
	const router = useRouter();

	return (
		<Box
			sx={{
				pt: 10,
				background: `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[100]} 100%)`,
				position: 'relative',
			}}
		>
			<Container maxWidth="lg">
				<SectionHeader
					subtitle="MEMBERSHIP"
					title="Flexible Membership Plans"
					description="Join The Short Grass community and enjoy exclusive benefits, priority access, and unlimited improvement for your game."
				/>

				<MembershipTiers
					onSelectTier={() => {
						router.push('/membership');
					}}
				/>
			</Container>
		</Box>
	);
};

export default MembershipPreview;
