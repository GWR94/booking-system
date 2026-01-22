import { Helmet } from 'react-helmet-async';

interface SEOProps {
	title: string;
	description?: string;
	name?: string;
	type?: string;
	keywords?: string[];
}

export const SEO = ({
	title,
	description,
	name = 'The Short Grass',
	type = 'website',
	keywords = [],
}: SEOProps) => {
	return (
		<Helmet>
			{/* Standard metadata tags */}
			<title>{title} | The Short Grass</title>
			<meta name="description" content={description} />
			{keywords.length > 0 && (
				<meta name="keywords" content={keywords.join(', ')} />
			)}

			{/* Facebook tags */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			{/* End Facebook tags */}

			{/* Twitter tags */}
			<meta name="twitter:creator" content={name} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			{/* End Twitter tags */}
		</Helmet>
	);
};
