import { errorResponse } from './responses';

export class ApiError extends Error {
	status: number;
	code?: string;

	constructor(message: string, status: number, code?: string) {
		super(message);
		this.status = status;
		this.code = code;
	}
}

export function asErrorResponse(err: unknown) {
	if (err instanceof ApiError) {
		return errorResponse(err.message, err.status, err.code);
	}
	return null;
}

