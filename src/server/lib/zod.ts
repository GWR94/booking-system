import type { z } from 'zod';

/**
 * Validates data with a Zod schema and returns either the parsed data or a single error message.
 *
 * Use this in API route handlers instead of calling `schema.safeParse()` and manually reading
 * `error.issues[0]`. It returns only the **first** validation error so the API can send one clear
 * message to the client (e.g. 400 with `{ message: "..." }`).
 *
 * @param schema - A Zod schema (e.g. `apiLoginSchema`, `apiBookingCreateSchema`).
 * @param data - The raw payload to validate (usually `await req.json()`).
 * @returns If valid: `{ success: true, data: T }` with typed `data`. If invalid: `{ success: false, message: string }`.
 *
 * @example
 * const parsed = parseWithFirstError(apiLoginSchema, body);
 * if (!parsed.success) {
 *   return NextResponse.json({ message: parsed.message }, { status: 400 });
 * }
 * const { email, password, rememberMe } = parsed.data;
 */
export const parseWithFirstError = <T>(
	schema: z.ZodType<T>,
	data: unknown,
): { success: true; data: T } | { success: false; message: string } => {
	const result = schema.safeParse(data);
	if (result.success) return { success: true, data: result.data };
	const first = result.error.issues[0];
	const message = first ? `${first.path.join('.')}: ${first.message}` : 'Validation failed';
	return { success: false, message };
};
