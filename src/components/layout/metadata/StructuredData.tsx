import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
	data: object;
}

export const StructuredData = ({ data }: StructuredDataProps) => {
	return (
		<Helmet>
			<script type="application/ld+json">{JSON.stringify(data)}</script>
		</Helmet>
	);
};
