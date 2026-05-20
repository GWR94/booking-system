'use client';

import React, { useMemo, useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Paper,
	Tabs,
	Tab,
	TextField,
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	InputAdornment,
	useTheme,
} from '@mui/material';
import {
	Search,
	ExpandMore,
	HelpOutline,
	LocalOffer,
	CreditCard,
	SportsGolf,
	EditCalendar,
	WorkspacePremium,
} from '@mui/icons-material';
import { ContactForm } from '@shared';
import { FaqItem, faqData } from '@constants/memberships';
import SearchBar from './SearchBar';
import { SectionHeader } from '@/components/ui';

const FAQ_CATEGORIES = [
	'All',
	'Booking',
	'Payment',
	'Facilities',
	'Account',
	'Membership',
] as const;

function categoryToTabIndex(category?: string): number {
	if (!category) {
		return 0;
	}
	const index = FAQ_CATEGORIES.findIndex(
		(name) => name.toLowerCase() === category.toLowerCase(),
	);
	return index >= 0 ? index : 0;
}

type HelpCenterProps = {
	initialCategory?: string;
};

const HelpCenter: React.FC<HelpCenterProps> = ({ initialCategory }) => {
	const theme = useTheme();
	const initialTab = useMemo(
		() => categoryToTabIndex(initialCategory),
		[initialCategory],
	);
	const [tabValue, setTabValue] = useState(initialTab);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredFaqs, setFilteredFaqs] =
		useState<Record<string, FaqItem[]>>(faqData);

	const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		filterFaqs(searchQuery, newValue);
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchQuery(query);
		filterFaqs(query, tabValue);
	};

	const filterFaqs = (query: string, tabIndex: number) => {
		if (query.trim() === '' && tabIndex === 0) {
			setFilteredFaqs(faqData);
			return;
		}

		const categoryKeys = Object.keys(faqData);
		const filteredData: Record<string, FaqItem[]> = {};

		categoryKeys.forEach((category) => {
			if (
				tabIndex > 0 &&
				category.toLowerCase() !== FAQ_CATEGORIES[tabIndex].toLowerCase()
			) {
				return;
			}

			const filteredItems = faqData[category].filter(
				(item) =>
					item.question.toLowerCase().includes(query.toLowerCase()) ||
					item.answer.toLowerCase().includes(query.toLowerCase()),
			);

			if (filteredItems.length > 0) {
				filteredData[category] = filteredItems;
			}
		});

		setFilteredFaqs(filteredData);
	};

	const getCategoryIcon = (category: string) => {
		switch (category.toLowerCase()) {
			case 'booking':
				return <EditCalendar color="primary" />;
			case 'payment':
				return <CreditCard color="primary" />;
			case 'facilities':
				return <SportsGolf color="primary" />;
			case 'account':
				return <LocalOffer color="primary" />;
			case 'membership':
				return <WorkspacePremium color="primary" />;
			default:
				return <HelpOutline color="primary" />;
		}
	};

	return (
		<Box>
			<SectionHeader
				title="FAQs"
				description="Find answers to common questions about our golf simulator booking system"
			/>
			<SearchBar value={searchQuery} onChange={handleSearch} />

			<Paper
				elevation={0}
				sx={{
					borderRadius: 2,
					border: `1px solid ${theme.palette.divider}`,
					mb: 4,
				}}
			>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					aria-label="help categories"
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						px: 2,
						'& .MuiTabs-flexContainer': {
							justifyContent: 'center',
						},
					}}
				>
					{FAQ_CATEGORIES.map((category) => (
						<Tab
							key={category}
							label={category}
							sx={{ fontWeight: 500, minWidth: 'auto' }}
						/>
					))}
				</Tabs>

				<Box sx={{ p: 3 }}>
					{Object.keys(filteredFaqs).length > 0 ? (
						Object.entries(filteredFaqs).map(([category, items]) => (
							<Box key={category} sx={{ mb: 4 }}>
								<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
									{getCategoryIcon(category)}
									<Typography
										variant="h6"
										sx={{
											ml: 1,
											fontWeight: 600,
											textTransform: 'capitalize',
										}}
									>
										{category} FAQs
									</Typography>
								</Box>

								{items.map((item, itemIndex) => (
									<Accordion
										key={`${category}-${itemIndex}`}
										elevation={0}
										disableGutters
										sx={{
											mb: 1,
											border: `1px solid ${theme.palette.divider}`,
											'&:before': { display: 'none' },
											borderRadius: 1,
											overflow: 'hidden',
										}}
									>
										<AccordionSummary
											expandIcon={<ExpandMore />}
											aria-controls={`panel-${category}-${itemIndex}-content`}
											id={`panel-${category}-${itemIndex}-header`}
											sx={{
												backgroundColor: 'background.default',
												'&.Mui-expanded': {
													backgroundColor: theme.palette.primary.light + '15',
												},
											}}
										>
											<Typography sx={{ fontWeight: 500 }}>
												{item.question}
											</Typography>
										</AccordionSummary>
										<AccordionDetails sx={{ pt: 1, pb: 2 }}>
											<Typography color="text.secondary">
												{item.answer}
											</Typography>
										</AccordionDetails>
									</Accordion>
								))}
							</Box>
						))
					) : (
						<Box sx={{ py: 4, textAlign: 'center' }}>
							<Typography variant="h6" color="text.secondary">
								No results found for "{searchQuery}"
							</Typography>
							<Typography variant="body1" sx={{ mt: 1 }}>
								Try a different search term or browse by category.
							</Typography>
						</Box>
					)}
				</Box>
			</Paper>
			<Container maxWidth="md" sx={{ px: { xs: 0, md: 3 } }}>
				<Paper
					elevation={0}
					sx={{
						mt: 4,
						borderRadius: 4,
						overflow: 'hidden',
						border: `1px solid ${theme.palette.divider}`,
					}}
				>
					<ContactForm />
				</Paper>
			</Container>
		</Box>
	);
};

export default HelpCenter;
