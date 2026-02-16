import { NextRequest } from 'next/server';
import { vi } from 'vitest';

/**
 * Creates a mock NextRequest object for testing API routes.
 */
export function createMockRequest(options: {
	method?: string;
	url?: string;
	body?: any;
	headers?: Record<string, string>;
	query?: Record<string, string>;
}) {
	const {
		method = 'GET',
		url = 'http://localhost:3000/api/test',
		body,
		headers = {},
		query = {},
	} = options;

	const fullUrl = new URL(url);
	Object.entries(query).forEach(([key, value]) => {
		fullUrl.searchParams.set(key, value);
	});

	const requestInit: RequestInit = {
		method,
		headers: new Headers(headers),
	};

	if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
		requestInit.body = JSON.stringify(body);
	}

	type NextRequestInit = ConstructorParameters<typeof NextRequest>[1];
	const request = new NextRequest(
		fullUrl.toString(),
		requestInit as NextRequestInit,
	);

	// Add helper for req.json() to return the body directly if needed
	if (body) {
		request.json = vi.fn().mockResolvedValue(body);
	}

	return request;
}

/**
 * Creates a mock params object matching Next.js App Router convention.
 * Params are wrapped in a Promise for Next.js 15+ compatibility.
 */
export function createMockParams<T extends Record<string, string>>(
	params: T,
): { params: Promise<T> } {
	return { params: Promise.resolve(params) };
}

/**
 * Note: vi.mock() calls are hoisted to the top of the file, so mock
 * factories cannot reference variables from the enclosing scope.
 * Each test file should define its own vi.mock() calls directly.
 * Use the helper functions above for creating requests and parsing responses.
 */

/**
 * Extract JSON body and status from a NextResponse.
 */
export async function parseResponse(response: Response) {
	const body = await response.json();
	return { body, status: response.status };
}
