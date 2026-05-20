import type { ReactNode } from 'react';
import {
	Box,
	Paper,
	Grid2 as Grid,
	Divider,
	Typography,
	Link,
	useTheme,
	alpha,
} from '@mui/material';
import {
	AccessTime,
	AlternateEmail,
	DirectionsBus,
	LocationOn,
	Phone,
} from '@mui/icons-material';
import FindOurLocation from '@/components/shared/FindOurLocation';
import SocialMediaIcons from '@/components/shared/SocialMediaIcons';
import { ContactForm } from '@/components/shared';
import COMPANY_INFO, {
	companyAddressMaps,
	companyEmailMailto,
	companyPhoneTel,
} from '@/constants/company';
import CompanyAddressText from '@/components/shared/CompanyAddressText';

type InfoItem = {
	title: string;
	description: ReactNode;
	icon: ReactNode;
	href?: string;
	external?: boolean;
};

const visitInfo: InfoItem[] = [
	{
		title: 'Opening Hours',
		description: 'Mon–Sat, 10:00 AM – 10:00 PM',
		icon: <AccessTime fontSize="small" />,
	},
	{
		title: 'Travel to us',
		description: 'Buses 14, 36, 42 · Maidstone East or West stations.',
		icon: <DirectionsBus fontSize="small" />,
	},
	{
		title: 'Getting here',
		description: 'Maidstone town centre, with free customer parking nearby.',
		icon: <LocationOn fontSize="small" />,
	},
];

const contactInfo: InfoItem[] = [
	{
		title: 'Call us',
		description: COMPANY_INFO.phone,
		href: companyPhoneTel,
		icon: <Phone fontSize="small" />,
	},
	{
		title: 'Email us',
		description: COMPANY_INFO.email,
		href: companyEmailMailto,
		icon: <AlternateEmail fontSize="small" />,
	},
	{
		title: 'Visit us',
		description: <CompanyAddressText />,
		href: companyAddressMaps,
		icon: <LocationOn fontSize="small" />,
		external: true,
	},
];

function InfoRow({ title, description, icon, href, external }: InfoItem) {
	const theme = useTheme();

	return (
		<Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
			<Box
				sx={{
					width: 40,
					height: 40,
					borderRadius: '50%',
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: theme.palette.secondary.main,
					bgcolor: alpha(theme.palette.secondary.main, 0.1),
				}}
			>
				{icon}
			</Box>
			<Box sx={{ minWidth: 0 }}>
				<Typography
					variant="body2"
					fontWeight={600}
					sx={{ lineHeight: 1.3, mb: 0.25 }}
				>
					{title}
				</Typography>
				{href ? (
					<Link
						href={href}
						underline="hover"
						color="secondary"
						{...(external
							? { target: '_blank', rel: 'noopener noreferrer' }
							: {})}
						sx={{
							display: 'block',
							fontSize: '0.875rem',
							lineHeight: 1.5,
							overflowWrap: 'break-word',
						}}
					>
						{description}
					</Link>
				) : (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ lineHeight: 1.5 }}
					>
						{description}
					</Typography>
				)}
			</Box>
		</Box>
	);
}

const PlanYourVisit = () => {
	const theme = useTheme();

	return (
		<Paper
			id="plan-your-visit"
			elevation={0}
			sx={{
				borderRadius: 4,
				overflow: 'hidden',
				border: `1px solid ${theme.palette.divider}`,
			}}
		>
			<Grid container alignItems="flex-start">
				<Grid
					size={{ xs: 12, md: 5 }}
					sx={{
						bgcolor: theme.palette.grey[50],
						borderRight: { md: `1px solid ${theme.palette.divider}` },
					}}
				>
					<Box sx={{ p: { xs: 3, md: 4 } }}>
						<FindOurLocation />
						<Divider sx={{ my: 2.5 }} />
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
							{visitInfo.map((item) => (
								<Box
									key={item.title}
									sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
								>
									<InfoRow {...item} />
								</Box>
							))}
						</Box>
						<Divider sx={{ my: 2.5 }} />
						<SocialMediaIcons layout="block" />
					</Box>
				</Grid>

				<Grid size={{ xs: 12, md: 7 }}>
					<ContactForm />
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 2,
							px: { xs: 3, md: 4 },
							py: 2,
							width: '60%',
							margin: '20px auto',
						}}
					>
						<Divider sx={{ flex: 1 }} />
						<Typography variant="body2" color="text.secondary">
							or
						</Typography>
						<Divider sx={{ flex: 1 }} />
					</Box>
					<ContactInfo />
				</Grid>
			</Grid>
		</Paper>
	);
};

const ContactInfo = () => (
	<Box
		sx={{
			px: { xs: 3, md: 4 },
			pb: { xs: 3, md: 4 },
			pt: 2.5,
			display: 'flex',
			justifyContent: 'center',
		}}
	>
		<Box
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				flexWrap: 'wrap',
				justifyContent: 'center',
				gap: { xs: 2.5, sm: 4 },
				width: '100%',
			}}
		>
			{contactInfo.map((item) => (
				<Box key={item.title} sx={{ minWidth: { sm: 140 } }}>
					<InfoRow {...item} />
				</Box>
			))}
		</Box>
	</Box>
);

export default PlanYourVisit;
