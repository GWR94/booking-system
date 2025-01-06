import { PaymentElement, useCheckout } from '@stripe/react-stripe-js';
import PayButton from './PayButton';

// Initialize Stripe with your publishable key
const CheckoutForm: React.FC = () => {
	const checkout = useCheckout();

	return (
		<form>
			<PaymentElement options={{ layout: 'accordion' }} />
			<PayButton />
		</form>
	);
};

export default CheckoutForm;
