import { COMPANY_INFO } from '@constants/company';
import { Metadata } from 'next';

interface SEOProps {
	title: string;
	description?: string;
	name?: string;
	type?: string;
	keywords?: string[];
}

// Metadata is defined via layout/page exports in App Router.
// This component is kept for call-site compatibility and returns null.
export const SEO = ({
	title,
	description,
	name = COMPANY_INFO.name,
	type = 'website',
	keywords = [],
}: SEOProps) => {
	return null;
};
