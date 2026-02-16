import { sign } from 'jsonwebtoken';

/**
 * User payload for JWT token generation
 */
interface UserPayload {
	/** User's unique ID */
	id: number;
	/** User's email address */
	email: string;
	/** Facebook OAuth ID if linked */
	facebookId?: string | null;
	/** Google OAuth ID if linked */
	googleId?: string | null;
	/** Twitter OAuth ID if linked */
	twitterId?: string | null;
	/** User's role (e.g., 'user', 'admin', 'guest') */
	role?: string;
}

/**
 * Generates JWT access and refresh tokens for user authentication
 *
 * Creates two tokens:
 * - Access token: Contains full user data, expires in 15 minutes
 * - Refresh token: Contains only user ID, expires in 7 days
 *
 * @param user - User information to encode in the tokens
 * @returns Object containing accessToken and refreshToken
 * @throws Error if ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET env vars are not set
 * @example
 * const { accessToken, refreshToken } = generateTokens({
 *   id: 123,
 *   email: 'user@example.com',
 *   role: 'user'
 * });
 * // Use accessToken for API requests, refreshToken to get new access tokens
 */
export const generateTokens = (user: UserPayload) => {
	const payload: UserPayload = {
		id: user.id,
		email: user.email,
		...(user.facebookId && { facebookId: user.facebookId }),
		...(user.googleId && { googleId: user.googleId }),
		...(user.twitterId && { twitterId: user.twitterId }),
		role: user.role,
	};

	const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
		expiresIn: '15m',
	});

	const refreshToken = sign(
		{ id: user.id },
		process.env.REFRESH_TOKEN_SECRET as string,
		{ expiresIn: '7d' }, // Longer lifetime
	);

	return { accessToken, refreshToken };
};
