/**
 * Server-side reCAPTCHA v2 verification.
 * Standard approach: client sends the response token; server verifies with Google's
 * siteverify API (https://developers.google.com/recaptcha/docs/verify). Use this in
 * API routes whenever you accept a recaptchaToken (e.g. guest checkout, contact forms).
 */

import axios from 'axios';

const SITEVERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
	const secret =
		process.env.RECAPTCHA_SECRET_KEY || process.env.CAPTCHA_SECRET_KEY;
	if (!secret) {
		console.warn(
			'RECAPTCHA_SECRET_KEY (or CAPTCHA_SECRET_KEY) not set; skipping verification',
		);
		return true;
	}
	if (!token || token.trim() === '') {
		return false;
	}

	try {
		const { data } = await axios.post<{ success?: boolean }>(
			SITEVERIFY_URL,
			new URLSearchParams({
				secret,
				response: token,
			}).toString(),
			{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			},
		);
		return data.success === true;
	} catch (err) {
		console.error('Recaptcha verify error:', err);
		return false;
	}
};
