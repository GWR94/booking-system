/**
 * Centralized validation schemas
 *
 * - form-schemas: Client-side validation with detailed error messages
 * - api-schemas: Server-side validation for API routes
 */

// Client-side form validation schemas
export { registrationSchema, loginSchema, guestSchema } from './form-schemas';

// Server-side API validation schemas
export {
	apiLoginSchema,
	apiRegisterSchema,
	apiContactSchema,
} from './api-schemas';
