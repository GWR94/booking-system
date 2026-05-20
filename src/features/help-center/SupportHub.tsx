'use client';

import React from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import HelpCenter from './HelpCenter';
import {
	DEFAULT_SUPPORT_SECTION,
	parseSupportSection,
	SUPPORT_SECTIONS,
	type SupportSection,
} from './supportSections';
import Terms from '@features/legal/Terms';
import PrivacyPolicy from '@features/legal/PrivacyPolicy';
import CookiesPolicy from '@features/legal/CookiesPolicy';

const SECTION_LABELS: Record<SupportSection, string> = {
	faqs: 'FAQs',
	terms: 'Terms',
	privacy: 'Privacy',
	cookies: 'Cookies',
};

const SupportHub: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const section = parseSupportSection(searchParams.get('section'));
	const faqCategory = searchParams.get('category') ?? undefined;
	const sectionIndex = SUPPORT_SECTIONS.indexOf(section);

	const handleSectionChange = (_: React.SyntheticEvent, newIndex: number) => {
		const next = SUPPORT_SECTIONS[newIndex];
		const params = new URLSearchParams();

		if (next !== DEFAULT_SUPPORT_SECTION) {
			params.set('section', next);
		}
		if (next === 'faqs' && faqCategory) {
			params.set('category', faqCategory);
		}

		const qs = params.toString();
		router.push(qs ? `/help?${qs}` : '/help', { scroll: false });
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
				<Tabs
					value={sectionIndex}
					onChange={handleSectionChange}
					aria-label="help and policies sections"
					sx={{
						width: 'max-content',
						borderBottom: 1,
						borderColor: 'divider',
					}}
				>
					{SUPPORT_SECTIONS.map((key) => (
						<Tab
							key={key}
							label={SECTION_LABELS[key]}
							sx={{ fontWeight: 500 }}
						/>
					))}
				</Tabs>
			</Box>

			{section === 'faqs' && <HelpCenter initialCategory={faqCategory} />}
			{section === 'terms' && <Terms />}
			{section === 'privacy' && <PrivacyPolicy />}
			{section === 'cookies' && <CookiesPolicy />}
		</Container>
	);
};

export default SupportHub;
