'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useSnackbar } from '@context';
import { registerUser, verifyUser } from '@api';
import type { RegisterCredentials, User } from '@features/auth/components';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { trackLogin, trackSignUp } from '@utils/analytics';
import { useEffect, useRef } from 'react';

export const useAuth = () => {
	const queryClient = useQueryClient();
	const { showSnackbar } = useSnackbar();
	const router = useRouter();
	const { data: session, status } = useSession();

	const hasSession = !!session?.user?.id;
	const invalidateSessionOnceRef = useRef(false);

	const {
		data: meUser,
		error: meError,
		isFetching: isVerifyingUser,
	} = useQuery({
		queryKey: ['user', 'me', session?.user?.id],
		queryFn: () => verifyUser(),
		enabled: hasSession,
		retry: (failureCount, error: any) => {
			// Allow one retry for transient post-login/session propagation timing.
			if (error?.response?.status === 401) return failureCount < 1;
			return false;
		},
	});

	const isUnauthorizedMeError = (meError as any)?.response?.status === 401;

	useEffect(() => {
		if (!hasSession) {
			invalidateSessionOnceRef.current = false;
			return;
		}

		if (!isUnauthorizedMeError || isVerifyingUser || invalidateSessionOnceRef.current)
			return;

		invalidateSessionOnceRef.current = true;
		void nextAuthSignOut({ redirect: false }).then(() => {
			queryClient.clear();
			router.refresh();
		});
	}, [
		hasSession,
		isUnauthorizedMeError,
		isVerifyingUser,
		queryClient,
		router,
		showSnackbar,
	]);

	const user = hasSession
		? {
				...(meUser ?? {}),
				id: meUser?.id ?? session?.user?.id,
				email: meUser?.email ?? session?.user?.email ?? null,
				name: meUser?.name ?? session?.user?.name ?? '',
				role: meUser?.role ?? session?.user?.role,
				membershipTier:
					meUser?.membershipTier ?? session?.user?.membershipTier ?? undefined,
				membershipStatus:
					meUser?.membershipStatus ?? session?.user?.membershipStatus ?? undefined,
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
			trackLogin('credentials');
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
			trackSignUp('email');
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
		isLoading: status === 'loading' || (hasSession && isVerifyingUser),
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
