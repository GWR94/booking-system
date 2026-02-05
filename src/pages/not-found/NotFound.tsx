import React from 'react';
import { Container, Typography, Button, Box, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@layout';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<Container maxWidth="md">
			<SEO
				title="404 Not Found"
				description="The page you are looking for does not exist."
			/>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '100vh',
					textAlign: 'center',
					padding: 4,
				}}
			>
				<ErrorOutlineIcon
					sx={{
						fontSize: 120,
						color: 'primary.main',
						marginBottom: 3,
					}}
				/>

				<Typography variant="h1" gutterBottom>
					404
				</Typography>

				<Typography variant="h4" gutterBottom>
					Page Not Found
				</Typography>

				<Typography
					variant="body1"
					color="text.secondary"
					sx={{ maxWidth: 500, marginBottom: 4 }}
				>
					Oops! The page you&apos;re looking for doesn&apos;t exist or has been
					moved. Let&apos;s help you get back on track.
				</Typography>

				<Stack direction="row" spacing={2}>
					<Button
						variant="contained"
						color="primary"
						onClick={() => navigate('/')}
					>
						Go to Home
					</Button>

					<Button
						variant="outlined"
						color="secondary"
						onClick={() => navigate(-1)}
					>
						Go Back
					</Button>
				</Stack>
			</Box>
		</Container>
	);
};

export default NotFound;
