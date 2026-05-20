import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Footer from './Footer';
import { ThemeProvider, createTheme } from '@mui/material';
import createWrapper from '@utils/test-utils';
import { supportSectionHref } from '@features/help-center/supportSections';
import COMPANY_INFO, {
	companyAddressMaps,
	companyEmailMailto,
	companyPhoneTel,
} from '@constants/company';

const theme = createTheme({
	palette: {
		primary: { main: '#000', contrastText: '#fff', dark: '#111' },
		secondary: { main: '#eee', light: '#eee' },
		accent: { main: '#f00' },
		error: { main: '#f00', light: '#f11', dark: '#f22' },
		divider: '#ccc',
		grey: { 500: '#999' },
	},
} as any);

vi.mock('@ui', () => ({
	Logo: () => <div data-testid="mock-logo">Logo</div>,
}));

vi.mock('next/link', () => ({
	default: ({
		children,
		href,
	}: {
		children: React.ReactNode;
		href: string;
	}) => <a href={href}>{children}</a>,
}));

const renderFooter = () => {
	return render(
		<ThemeProvider theme={theme}>
			<Footer />
		</ThemeProvider>,
		{ wrapper: createWrapper() },
	);
};

describe('Footer', () => {
	it('should render logo', () => {
		renderFooter();
		expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
	});

	it('should render social media links', () => {
		renderFooter();
		expect(screen.getByLabelText('Facebook')).toHaveAttribute(
			'href',
			expect.stringContaining('facebook.com'),
		);
		expect(screen.getByLabelText('Instagram')).toHaveAttribute(
			'href',
			expect.stringContaining('instagram.com'),
		);
		expect(screen.getByLabelText('X (Formerly Twitter)')).toHaveAttribute(
			'href',
			expect.stringContaining('x.com'),
		);
	});

	it('should render support links to the help hub', () => {
		renderFooter();
		expect(screen.getByRole('link', { name: 'FAQs' })).toHaveAttribute(
			'href',
			supportSectionHref('faqs'),
		);
		expect(
			screen.getByRole('link', { name: 'Terms & Conditions' }),
		).toHaveAttribute('href', supportSectionHref('terms'));
		expect(
			screen.getByRole('link', { name: 'Privacy Policy' }),
		).toHaveAttribute('href', supportSectionHref('privacy'));
		expect(
			screen.getByRole('link', { name: 'Cookies Policy' }),
		).toHaveAttribute('href', supportSectionHref('cookies'));
	});

	it('should render actionable contact links', () => {
		renderFooter();

		expect(
			screen.getByLabelText(`Open ${COMPANY_INFO.address} in Google Maps`),
		).toHaveAttribute('href', companyAddressMaps);

		expect(screen.getByLabelText(`Call ${COMPANY_INFO.phone}`)).toHaveAttribute(
			'href',
			companyPhoneTel,
		);

		expect(
			screen.getByLabelText(`Email ${COMPANY_INFO.email}`),
		).toHaveAttribute('href', companyEmailMailto);

		expect(screen.getByText(COMPANY_INFO.phone)).toBeInTheDocument();
		expect(screen.getByText(COMPANY_INFO.email)).toBeInTheDocument();
	});

	it('should render copyright with current year', () => {
		renderFooter();
		const currentYear = new Date().getFullYear().toString();
		expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
		expect(screen.getByText(/James Gower/i)).toBeInTheDocument();
	});
});
