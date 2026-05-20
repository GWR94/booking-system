import { AnimateIn } from '@components/ui';
import { TierInfo, memberships } from '@constants/memberships';
import { Grid2 as Grid } from '@mui/material';
import MembershipTierCard from './MembershipTierCard';

type MembershipTiersProps = {
	onSelectTier?: (tier: TierInfo) => void;
	getButtonLabel?: (tier: TierInfo) => string;
	isTierDisabled?: (tier: TierInfo) => boolean;
	isCurrentActiveTier?: (tier: TierInfo) => boolean;
	loadingTierTitle?: string | null;
};

const MembershipTiers = ({
	onSelectTier,
	getButtonLabel,
	isTierDisabled,
	isCurrentActiveTier,
	loadingTierTitle,
}: MembershipTiersProps) => {
	return (
		<Grid
			container
			spacing={{ xs: 2, lg: 4 }}
			alignItems="stretch"
			justifyContent="center"
			sx={{ width: '100%' }}
		>
			{memberships.map((tier, i) => (
				<Grid key={tier.title} size={{ xs: 12, md: 4 }} sx={{ pb: 5 }}>
					<AnimateIn type="fade-up" delay={i * 0.2} style={{ height: '100%' }}>
						<MembershipTierCard
							tier={tier}
							onSelect={onSelectTier}
							buttonLabel={getButtonLabel?.(tier)}
							disabled={isTierDisabled?.(tier) ?? false}
							loading={loadingTierTitle === tier.title}
							isCurrentActiveTier={isCurrentActiveTier?.(tier) ?? false}
						/>
					</AnimateIn>
				</Grid>
			))}
		</Grid>
	);
};

export default MembershipTiers;
