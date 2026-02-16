'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@api';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Chip,
	Box,
	TextField,
	InputAdornment,
	IconButton,
	Tooltip,
	alpha,
	useTheme,
} from '@mui/material';
import {
	Search as SearchIcon,
	Visibility as ViewIcon,
	Edit as EditIcon,
} from '@mui/icons-material';
import { LoadingSpinner, AnimateIn, SectionHeader } from '@ui';
import { useState } from 'react';
import UserBookingsModal from './components/UserBookingsModal';
import EditUserModal from './components/EditUserModal';

const Users = () => {
	const theme = useTheme();
	const [search, setSearch] = useState('');
	const [selectedUser, setSelectedUser] = useState<any>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState<any>(null);

	const { data: users, isLoading } = useQuery({
		queryKey: ['adminUsers'],
		queryFn: getAllUsers,
	});

	if (isLoading) return <LoadingSpinner />;

	const filteredUsers =
		users?.filter(
			(user: any) =>
				user.name?.toLowerCase().includes(search.toLowerCase()) ||
				user.email?.toLowerCase().includes(search.toLowerCase()) ||
				user.id.toString().includes(search),
		) || [];

	const handleViewUser = (user: any) => {
		setSelectedUser(user);
		setModalOpen(true);
	};

	const handleEditUser = (user: any) => {
		setUserToEdit(user);
		setEditModalOpen(true);
	};

	return (
		<Box sx={{ py: 4 }}>
			<Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
				<SectionHeader
					title="User Management"
					subtitle="Admin Portal"
					description="Manage registered users and their memberships"
					noAnimation
				/>
				<AnimateIn type="fade-up">
					<Paper
						elevation={0}
						sx={{
							borderRadius: 4,
							border: 'none',
							boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
							overflow: 'hidden',
						}}
					>
						<Box sx={{ p: 2 }}>
							<TextField
								fullWidth
								variant="outlined"
								placeholder="Search users by name, email, or ID..."
								size="small"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								slotProps={{
									input: {
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon color="action" />
											</InputAdornment>
										),
									},
								}}
							/>
						</Box>
						<TableContainer>
							<Table
								sx={{ minWidth: 650 }}
								aria-label="users table"
								size="small"
							>
								<TableHead
									sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}
								>
									<TableRow>
										<TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Membership</TableCell>
										<TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
										<TableCell align="right" sx={{ fontWeight: 600 }}>
											Actions
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredUsers.map((user: any) => (
										<TableRow
											key={user.id}
											hover
											sx={{
												'&:last-child td, &:last-child th': { border: 0 },
												cursor: 'pointer',
											}}
											onClick={() => handleViewUser(user)}
										>
											<TableCell
												component="th"
												scope="row"
												sx={{ fontWeight: 500 }}
											>
												{user.id}
											</TableCell>
											<TableCell>
												<Typography variant="body2" fontWeight={600}>
													{user.name}
												</Typography>
											</TableCell>
											<TableCell sx={{ maxWidth: 200 }}>
												<Tooltip title={user.email} placement="top">
													<Typography
														variant="body2"
														noWrap
														sx={{
															cursor: 'help',
															// textDecoration: 'underline',
															// textDecorationStyle: 'dotted',
														}}
													>
														{user.email}
													</Typography>
												</Tooltip>
											</TableCell>
											<TableCell>
												{user.membershipTier ? (
													<Chip
														label={user.membershipTier}
														size="small"
														color="primary"
														variant={
															user.membershipStatus === 'ACTIVE'
																? 'filled'
																: 'outlined'
														}
														sx={{ fontWeight: 600 }}
													/>
												) : (
													<Typography variant="caption" color="text.secondary">
														None
													</Typography>
												)}
											</TableCell>
											<TableCell>
												{user.membershipStatus === 'ACTIVE' &&
												user.cancelAtPeriodEnd ? (
													<Chip
														label="CANCELLING"
														color="warning"
														size="small"
														sx={{ fontWeight: 600 }}
													/>
												) : (
													<Chip
														label={user.membershipStatus || 'INACTIVE'}
														color={
															user.membershipStatus === 'ACTIVE'
																? 'success'
																: user.membershipStatus === 'CANCELLED'
																	? 'error'
																	: 'default'
														}
														size="small"
														sx={{ fontWeight: 600 }}
													/>
												)}
											</TableCell>
											<TableCell align="right">
												<Box
													sx={{ display: 'flex', justifyContent: 'flex-end' }}
												>
													<Tooltip title="View Bookings">
														<IconButton
															size="small"
															onClick={(e) => {
																e.stopPropagation();
																handleViewUser(user);
															}}
														>
															<ViewIcon fontSize="small" />
														</IconButton>
													</Tooltip>
													<Tooltip title="Edit User">
														<IconButton
															size="small"
															onClick={(e) => {
																e.stopPropagation();
																handleEditUser(user);
															}}
															sx={{ ml: 1 }}
														>
															<EditIcon fontSize="small" />
														</IconButton>
													</Tooltip>
												</Box>
											</TableCell>
										</TableRow>
									))}
									{filteredUsers.length === 0 && (
										<TableRow>
											<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
												<Typography variant="body2" color="text.secondary">
													No users found matching "{search}"
												</Typography>
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</AnimateIn>
			</Box>

			<UserBookingsModal
				user={selectedUser}
				open={modalOpen}
				onClose={() => setModalOpen(false)}
			/>

			<EditUserModal
				user={userToEdit}
				open={editModalOpen}
				onClose={() => setEditModalOpen(false)}
			/>
		</Box>
	);
};

export default Users;
