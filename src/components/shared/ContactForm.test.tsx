import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactForm from './ContactForm';
import { sendContactMessage } from '@api';
import createWrapper from '@utils/test-utils';
import { ThemeProvider, createTheme } from '@mui/material';

vi.mock('@api', () => ({
	sendContactMessage: vi.fn(),
}));

const theme = createTheme();

const renderForm = () => {
	return render(
		<ThemeProvider theme={theme}>
			<ContactForm />
		</ThemeProvider>,
		{ wrapper: createWrapper() },
	);
};

describe('ContactForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render all form fields', () => {
		renderForm();
		expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
	});

	it('should show error messages for invalid inputs on submit', async () => {
		const { container } = renderForm();

		const form = container.querySelector('form');
		if (!form) throw new Error('Form not found');

		fireEvent.submit(form);

		// Use findByText which has a default timeout of 1000ms, should be enough but let's be safe
		expect(await screen.findByText('Name is required')).toBeInTheDocument();
		expect(
			await screen.findByText('Valid email is required'),
		).toBeInTheDocument();
		expect(
			await screen.findByText('Please select a subject'),
		).toBeInTheDocument();
		expect(
			await screen.findByText('Please enter your message'),
		).toBeInTheDocument();
	});

	it('should successfully submit the form', async () => {
		(sendContactMessage as any).mockResolvedValue({ success: true });
		renderForm();

		fireEvent.change(screen.getByLabelText(/Full Name/i), {
			target: { value: 'John Doe' },
		});
		fireEvent.change(screen.getByLabelText(/Email Address/i), {
			target: { value: 'john@example.com' },
		});

		const subjectSelect = screen.getByLabelText(/Subject/i);
		fireEvent.mouseDown(subjectSelect);
		const option = await screen.findByText(/General Inquiry/i);
		fireEvent.click(option);

		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: 'Hello world' },
		});

		const submitBtn = screen.getByRole('button', { name: /Send Message/i });
		fireEvent.click(submitBtn);

		await waitFor(() => {
			expect(sendContactMessage).toHaveBeenCalledWith({
				name: 'John Doe',
				email: 'john@example.com',
				phone: '',
				subject: 'General Inquiry',
				message: 'Hello world',
			});
			expect(screen.getByText(/Thank You!/i)).toBeInTheDocument();
		});
	});

	it('should handle submission failure', async () => {
		(sendContactMessage as any).mockRejectedValue(new Error('API Error'));
		renderForm();

		fireEvent.change(screen.getByLabelText(/Full Name/i), {
			target: { value: 'John Doe' },
		});
		fireEvent.change(screen.getByLabelText(/Email Address/i), {
			target: { value: 'john@example.com' },
		});
		const subjectSelect = screen.getByLabelText(/Subject/i);
		fireEvent.mouseDown(subjectSelect);
		fireEvent.click(await screen.findByText(/General Inquiry/i));
		fireEvent.change(screen.getByLabelText(/Message/i), {
			target: { value: 'Hello' },
		});

		const submitBtn = screen.getByRole('button', { name: /Send Message/i });
		fireEvent.click(submitBtn);

		await waitFor(() => {
			expect(sendContactMessage).toHaveBeenCalled();
			expect(screen.queryByText(/Thank You!/i)).not.toBeInTheDocument();
		});
	});
});
