import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '@context';
import { verifyUser, loginUser, logoutUser, registerUser } from '@api';

export function useAuth() {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['auth'],
		queryFn: verifyUser,
		retry: false,
		staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
	});

	const loginMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: (user) => {
			queryClient.setQueryData(['auth'], user);
			showSnackbar('Successfully signed in', 'success');
		},
		onError: (error: any) => {
			showSnackbar(
				error.response?.data?.message ??
					'Unable to sign in.\nPlease try again.',
				'error',
			);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			queryClient.setQueryData(['auth'], null);
			showSnackbar('Successfully logged out', 'success');
		},
	});

	const registerMutation = useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			showSnackbar('User successfully registered', 'success');
		},
		onError: (error: any) => {
			showSnackbar(
				error.response?.data?.message ?? 'Unable to complete registration',
				'error',
			);
		},
	});

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		isAdmin: user?.role === 'admin',
		login: loginMutation.mutateAsync,
		logout: logoutMutation.mutateAsync,
		register: registerMutation.mutateAsync,
		error,
	};
}
