import { Search } from '@mui/icons-material';
import {
	Paper,
	TextField,
	InputAdornment,
	Button,
	useTheme,
} from '@mui/material';

type Props = {
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function SearchBar({ value, onChange }: Props) {
	const theme = useTheme();
	return (
		<Paper
			elevation={0}
			sx={{
				maxWidth: 600,
				mx: 'auto',
				display: 'flex',
				borderRadius: 2,
				border: `1px solid ${theme.palette.divider}`,
				mb: 4,
			}}
		>
			<TextField
				fullWidth
				placeholder="Search for help..."
				variant="outlined"
				value={value}
				onChange={onChange}
				sx={{
					'& .MuiOutlinedInput-root': {
						'& fieldset': {
							borderColor: 'transparent',
						},
						'&:hover fieldset': {
							borderColor: 'transparent',
						},
						'&.Mui-focused fieldset': {
							borderColor: 'transparent',
						},
					},
				}}
				slotProps={{
					input: {
						startAdornment: (
							<InputAdornment position="start">
								<Search color="action" />
							</InputAdornment>
						),
					},
				}}
			/>
			<Button
				variant="contained"
				color="primary"
				sx={{
					ml: 1,
					borderTopLeftRadius: 0,
					borderBottomLeftRadius: 0,
				}}
			>
				Search
			</Button>
		</Paper>
	);
}

export default SearchBar;
