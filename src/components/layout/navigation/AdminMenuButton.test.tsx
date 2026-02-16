import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminMenuButton from './AdminMenuButton';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
	palette: {
		link: {
			main: '#54cebf',
			light: '#7fddd0',
			dark: '#2a9d8f',
			contrastText: '#000000',
		},
	},
});
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

describe('AdminMenuButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const renderAdminMenuButton = (props = {}) => {
		return render(
			<ThemeProvider theme={theme}>
				<AdminMenuButton {...props} />
			</ThemeProvider>,
		);
	};

	it('should render admin icon button', () => {
		renderAdminMenuButton();
		expect(screen.getByLabelText(/Admin dashboard/i)).toBeInTheDocument();
	});

	it('should open menu when clicked on desktop', async () => {
		renderAdminMenuButton();
		const btn = screen.getByLabelText(/Admin dashboard/i);
		fireEvent.click(btn);

		expect(await screen.findByText('Admin')).toBeInTheDocument();
		expect(screen.getByText(/Bookings/i)).toBeInTheDocument();
	});

	it('should navigate and close menu when item clicked', async () => {
		renderAdminMenuButton();
		fireEvent.click(screen.getByLabelText(/Admin dashboard/i));

		const bookingsItem = await screen.findByText(/Bookings/i);
		fireEvent.click(bookingsItem);

		expect(mockPush).toHaveBeenCalled();
		await waitFor(() => {
			expect(screen.queryByText('Admin')).not.toBeInTheDocument();
		});
	});

	it('should call onMobileClick when clicked on mobile', () => {
		const onMobileClick = vi.fn();
		renderAdminMenuButton({ isMobile: true, onMobileClick });

		const btn = screen.getByLabelText(/Admin dashboard/i);
		fireEvent.click(btn);

		expect(onMobileClick).toHaveBeenCalled();
		expect(screen.queryByText('Admin')).not.toBeInTheDocument();
	});

	it('should close menu on window scroll', async () => {
		renderAdminMenuButton();
		fireEvent.click(screen.getByLabelText(/Admin dashboard/i));
		expect(await screen.findByText('Admin')).toBeInTheDocument();

		fireEvent.scroll(window);
		await waitFor(() => {
			expect(screen.queryByText('Admin')).not.toBeInTheDocument();
		});
	});
});
