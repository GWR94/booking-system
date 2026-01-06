import React, { useState } from 'react';
import {
	Box,
	Container,
	Typography,
	Paper,
	Tabs,
	Tab,
	Grid2 as Grid,
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
} from '@mui/icons-material';
import { FaqItem, faqData } from '../data/faq';
import { ContactForm } from '@components/common';

const HelpCenter: React.FC = () => {
	const theme = useTheme();
	const [tabValue, setTabValue] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [filteredFaqs, setFilteredFaqs] =
		useState<Record<string, FaqItem[]>>(faqData);

	// Category names for tabs
	const categories = ['All', 'Booking', 'Payment', 'Facilities', 'Account'];

	// Handle tab change
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		filterFaqs(searchQuery, newValue);
	};

	// Handle search
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchQuery(query);
		filterFaqs(query, tabValue);
	};

	// Filter FAQs based on search query and selected tab
	const filterFaqs = (query: string, tabIndex: number) => {
		if (query.trim() === '' && tabIndex === 0) {
			setFilteredFaqs(faqData);
			return;
		}

		const categoryKeys = Object.keys(faqData);
		const filteredData: Record<string, FaqItem[]> = {};

		categoryKeys.forEach((category) => {
			// Skip this category if a specific tab is selected and it's not this one
			if (
				tabIndex > 0 &&
				category.toLowerCase() !== categories[tabIndex].toLowerCase()
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

	// Get icon based on category
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
			default:
				return <HelpOutline color="primary" />;
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box sx={{ mb: 5 }}>
				<Typography variant="title" sx={{ mb: 4 }}>
					Help Center
				</Typography>
				<Typography
					variant="h6"
					component="h2"
					align="center"
					color="text.secondary"
					sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}
				>
					Find answers to common questions about our golf simulator booking
					system
				</Typography>

				{/* Search Bar */}
				<Paper
					elevation={0}
					sx={{
						maxWidth: 600,
						mx: 'auto',
						display: 'flex',
						borderRadius: 2,
						border: `1px solid ${theme.palette.divider}`,
					}}
				>
					<TextField
						fullWidth
						placeholder="Search for help..."
						variant="outlined"
						value={searchQuery}
						onChange={handleSearch}
						sx={{
							'& .MuiOutlinedInput-root': {
								'& fieldset': {
									borderColor: 'transparent',
								},
								'&:hover fieldset': {
									borderColor: 'transparent',
								},
								'&.Mui-focused fieldset': {
									borderColor: 'transparent',
								},
							},
						}}
						slotProps={{
							input: {
								startAdornment: (
									<InputAdornment position="start">
										<Search color="action" />
									</InputAdornment>
								),
							},
						}}
					/>
					<Button
						variant="contained"
						color="primary"
						sx={{
							ml: 1,
							borderTopLeftRadius: 0,
							borderBottomLeftRadius: 0,
						}}
					>
						Search
					</Button>
				</Paper>
			</Box>

			{/* Category Tabs */}
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
					}}
				>
					{categories.map((category, index) => (
						<Tab key={index} label={category} sx={{ fontWeight: 500 }} />
					))}
				</Tabs>

				{/* FAQ Accordions */}
				<Box sx={{ p: 3 }}>
					{Object.keys(filteredFaqs).length > 0 ? (
						Object.entries(filteredFaqs).map(
							([category, items], categoryIndex) => (
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
							),
						)
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
			<ContactForm />
		</Container>
	);
};

export default HelpCenter;
