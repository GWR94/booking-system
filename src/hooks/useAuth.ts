'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useSnackbar } from '@context';
import { registerUser, verifyUser } from '@api';
import type { RegisterCredentials, User } from '@features/auth/components';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export const useAuth = () => {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();
	const router = useRouter();
	const { data: session, status } = useSession();

	const { data: meUser } = useQuery({
		queryKey: ['user', 'me', session?.user?.id],
		queryFn: () => verifyUser(),
		enabled: !!session?.user?.id,
	});

	const user = session?.user
		? {
				id: session.user.id,
				email: session.user.email,
				name: session.user.name,
				role: session.user.role,
				membershipTier: session.user.membershipTier,
				membershipStatus: session.user.membershipStatus,
				membershipUsage: meUser?.membershipUsage ?? undefined,
				hasPassword: meUser?.hasPassword,
				googleId: meUser?.googleId,
				facebookId: meUser?.facebookId,
				twitterId: meUser?.twitterId,
				bookings: meUser?.bookings,
			}
		: null;

	const loginMutation = useMutation({
		mutationFn: async (credentials: { email: string; password: string }) => {
			const result = await signIn('credentials', {
				email: credentials.email,
				password: credentials.password,
				redirect: false,
			});
			if (result?.error) {
				throw new Error(result.error);
			}
			return result;
		},
		onSuccess: () => {
			showSnackbar('Successfully signed in', 'success');
			router.refresh();
		},
		onError: (error: any) => {
			showSnackbar(
				error.message ?? 'Unable to sign in.\nPlease try again.',
				'error',
			);
		},
	});

	const logoutMutation = useMutation({
		mutationFn: async () => {
			await nextAuthSignOut({ redirect: false });
		},
		onSuccess: () => {
			queryClient.clear();
			showSnackbar('Successfully logged out', 'success');
			router.push('/');
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

	type UseAuthReturnType = {
		user: User | null;
		isLoading: boolean;
		isAuthenticated: boolean;
		isAdmin: boolean;
		login: (credentials: { email: string; password: string }) => Promise<void>;
		logout: () => Promise<void>;
		register: (credentials: RegisterCredentials) => Promise<void>;
	};

	const useAuth: UseAuthReturnType = {
		user,
		isLoading: status === 'loading',
		isAuthenticated: !!user,
		isAdmin: user?.role === 'admin',
		login: async (credentials) => {
			await loginMutation.mutateAsync(credentials);
		},
		logout: async () => {
			await logoutMutation.mutateAsync();
		},
		register: async (credentials) => {
			await registerMutation.mutateAsync(credentials);
		},
	};

	return useAuth;
};
