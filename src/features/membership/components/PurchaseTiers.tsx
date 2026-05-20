'use client';

import { TestPaymentNotice } from '@features/checkout/components';
import { useSnackbar, useUI } from '@context';
import { useAuth } from '@hooks';
import { Box } from '@mui/material';
import { createSubscriptionSession } from '@api';
import { useState } from 'react';
import type { TierInfo } from '@/constants/memberships';
import MembershipTiers from './MembershipTiers';

const PurchaseTiers = () => {
	const { showSnackbar } = useSnackbar();
	const { openAuthModal } = useUI();
	const [loadingTierTitle, setLoadingTierTitle] = useState<string | null>(null);
	const { isAuthenticated, user } = useAuth();

	const handleSubscribe = async (tier: TierInfo) => {
		if (!isAuthenticated) {
			showSnackbar('You must be logged in to subscribe', 'warning');
			openAuthModal('login');
			return;
		}
		try {
			setLoadingTierTitle(tier.title);
			const response = await createSubscriptionSession(tier.tierKey);

			setLoadingTierTitle(null);

			if (response.url) {
				window.location.href = response.url;
			}
		} catch (error) {
			setLoadingTierTitle(null);
			showSnackbar('Error starting subscription', 'error');
			console.error('Error starting subscription:', error);
		}
	};

	return (
		<Box
			component="section"
			id="membership-tiers"
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				scrollMarginTop: { xs: '72px', sm: '88px' },
			}}
		>
			<MembershipTiers
				onSelectTier={handleSubscribe}
				loadingTierTitle={loadingTierTitle}
				isCurrentActiveTier={(tier) =>
					user?.membershipTier === tier.tierKey &&
					user?.membershipStatus === 'ACTIVE'
				}
				getButtonLabel={(tier) =>
					user?.membershipTier === tier.tierKey &&
					user?.membershipStatus === 'ACTIVE'
						? 'Current Plan'
						: `Purchase ${tier.title}`
				}
				isTierDisabled={(tier) =>
					user?.membershipTier === tier.tierKey &&
					user?.membershipStatus === 'ACTIVE'
				}
			/>
			<TestPaymentNotice membership sx={{ mt: 4 }} />
		</Box>
	);
};

export default PurchaseTiers;
