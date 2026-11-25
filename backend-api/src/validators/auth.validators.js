import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 6;

// Trim + lower-case first, then check the format (same normalisation the User model applies)
const email = z
  .string({ error: 'Email is required' })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: 'Please enter a valid email' }));

export const registerSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .trim()
    .min(1, { error: 'Name is required' })
    .max(100, { error: 'Name must be at most 100 characters' }),
  email,
  password: z
    .string({ error: 'Password is required' })
    .min(MIN_PASSWORD_LENGTH, {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    }),
});

// No length rule on login: just "something was sent" – the password check does the rest
export const loginSchema = z.object({
  email,
  password: z.string({ error: 'Password is required' }).min(1, { error: 'Password is required' }),
});
