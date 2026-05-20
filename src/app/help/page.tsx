import SupportHub from '@features/help-center/SupportHub';
import {
	HELP_PAGE_DESCRIPTION,
	buildHelpCenterPageJsonLd,
} from '@features/help-center/helpCenterStructuredData';
import { StructuredData } from '@layout';
import { getPublicSiteUrl } from '@utils/site-url';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress, Container } from '@mui/material';

export const metadata: Metadata = {
	title: 'Help | The Short Grass',
	description: HELP_PAGE_DESCRIPTION,
};

function HelpLoading() {
	return (
		<Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
			<CircularProgress aria-label="Loading help center" />
		</Container>
	);
}

export default function HelpPage() {
	const site = getPublicSiteUrl();

	return (
		<>
			<StructuredData data={buildHelpCenterPageJsonLd(site)} />
			<Suspense fallback={<HelpLoading />}>
				<SupportHub />
			</Suspense>
		</>
	);
}
