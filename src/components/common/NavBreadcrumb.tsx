import { NavigateNext } from '@mui/icons-material';
import { Container, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const NavBreadcrumb = () => {
	const location = useLocation();
	const path = location.pathname;
	const segments = path.split('/').filter(Boolean); // Remove empty strings

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Breadcrumbs
				separator={<NavigateNext fontSize="small" />}
				aria-label="breadcrumb"
			>
				<Link component={RouterLink} to="/" underline="hover" color="inherit">
					Home
				</Link>
				{segments.map((segment, index) => (
					<Link
						key={index}
						component={RouterLink}
						to={`/${segments.slice(0, index + 1).join('/')}`}
						underline="hover"
						color="inherit"
					>
						{segment.charAt(0).toUpperCase() + segment.slice(1)}
					</Link>
				))}
			</Breadcrumbs>
		</Container>
	);
};

export default NavBreadcrumb;
