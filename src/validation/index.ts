/**
 * Centralized validation schemas
 *
 * - form-schemas: Client-side validation with detailed error messages
 * - api-schemas: Server-side validation for API routes
 */

export { registrationSchema, loginSchema, guestSchema } from './form-schemas';

export {
	apiLoginSchema,
	apiRegisterSchema,
	apiContactSchema,
} from './api-schemas';
