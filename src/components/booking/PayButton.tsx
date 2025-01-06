import React from 'react';
import { useCheckout } from '@stripe/react-stripe-js';
import { Button } from '@mui/material';

const PayButton = () => {
	const { confirm } = useCheckout();
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<{ message: string } | null>(null);

	const handleClick = () => {
		setLoading(true);
		confirm().then((result: any) => {
			if (result.type === 'error') {
				setError(result.error);
			}
			setLoading(false);
		});
	};

	return (
		<div>
			<Button
				variant="contained"
				color="success"
				disabled={!loading}
				onClick={handleClick}
			>
				Pay
			</Button>
			{error && <div>{error.message as string}</div>}
		</div>
	);
};

export default PayButton;
