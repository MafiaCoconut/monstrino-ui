import { z } from 'zod';

/**
 * Example: User validation schema
 */
export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  age: z.number().int().min(13).optional(),
  createdAt: z.string().datetime().or(z.date()),
});

export type User = z.infer<typeof userSchema>;

/**
 * Example: Login form validation
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Example: Registration form validation
 */
export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

/**
 * Example: Release API response validation
 */
export const releaseSchema = z.object({
  internal_id: z.string(),
  name: z.string(),
  release_date: z.string().datetime().nullable(),
  price: z.number().positive().nullable(),
  description: z.string().nullable(),
  images: z.array(z.string().url()).default([]),
  series: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
});

export type Release = z.infer<typeof releaseSchema>;

/**
 * Example: API response wrapper
 */
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  });

/**
 * Example: Paginated API response
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    hasMore: z.boolean(),
  });

/**
 * Example: Environment variables validation
 */
export const envSchema = z.object({
  VITE_BACKEND_URL: z.string().url(),
  VITE_LOGIN_DISABLED: z
    .string()
    .transform(val => val === 'true')
    .optional(),
  VITE_REGISTRATION_DISABLED: z
    .string()
    .transform(val => val === 'true')
    .optional(),
});

// Validate environment variables at runtime
export function validateEnv() {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('Invalid environment variables:', error);
    throw new Error('Application configuration is invalid');
  }
}
