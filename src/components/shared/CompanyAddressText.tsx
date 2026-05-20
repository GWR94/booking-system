import { Box, type BoxProps } from '@mui/material';
import { companyAddressMultiline } from '@/constants/company';

type CompanyAddressTextProps = BoxProps<'span'>;

/** Renders the company address with a line break after each comma-separated part. */
const CompanyAddressText = ({ sx, ...props }: CompanyAddressTextProps) => (
	<Box component="span" sx={{ whiteSpace: 'pre-line', ...sx }} {...props}>
		{companyAddressMultiline}
	</Box>
);

export default CompanyAddressText;
