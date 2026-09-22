import { z } from 'zod';
import { INDIA_PHONE_LENGTH } from './phone';

// Forms hold the 10-digit national number; `toE164Phone` adds the `+91` on submit,
// because that is the shape the API stores. Validating the national number keeps the
// error message about the part the shopper actually typed.
export const phoneNationalSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\d+$/, 'Digits only')
  .length(INDIA_PHONE_LENGTH, `Enter a ${INDIA_PHONE_LENGTH}-digit mobile number`)
  .regex(/^[6-9]/, 'Indian mobile numbers start with 6, 7, 8 or 9');

// E.164 (`+919876543210`) — what goes over the wire, and what the API returns.
export const phoneE164Schema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\+[1-9]\d{1,14}$/, 'Enter phone with country code, e.g. +919876543210');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .email('Enter a valid email address');

const optionalEmailSchema = z
  .string()
  .max(254, 'Email is too long')
  .email('Enter a valid email address')
  .optional()
  .or(z.literal(''));

const nameSchema = (field: string) =>
  z
    .string()
    .trim()
    .min(2, `${field} must be at least 2 characters`)
    .max(50, `${field} must be under 50 characters`)
    .regex(/^[\p{L}][\p{L}\s'.-]*$/u, `${field} can only contain letters`);

// POST /auth/login  { phone, password }
export const loginSchema = z.object({
  phone: phoneNationalSchema,
  password: z.string().min(1, 'Password is required'),
});

// POST /auth/register  { firstName, lastName, phone, email?, password }
export const registerSchema = z.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  phone: phoneNationalSchema,
  email: optionalEmailSchema,
  password: passwordSchema,
});

// POST /auth/verify-otp (phone is in Redux pendingPhone)
export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, 'Enter the code we sent you')
    .length(6, 'Enter the 6-digit code')
    .regex(/^\d{6}$/, 'Digits only'),
});

export const forgotPasswordSchema = z.object({
  phone: phoneNationalSchema,
});

export const addressSchema = z.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  phone: phoneNationalSchema,
  address: z
    .string()
    .trim()
    .min(5, 'Enter the full street address')
    .max(120, 'Address must be under 120 characters'),
  apartment: z.string().trim().max(60, 'Must be under 60 characters').optional(),
  city: z
    .string()
    .trim()
    .min(2, 'City is required')
    .max(60, 'City must be under 60 characters')
    .regex(/^[\p{L}][\p{L}\s'.-]*$/u, 'City can only contain letters'),
  state: z
    .string()
    .trim()
    .min(2, 'State is required')
    .max(60, 'State must be under 60 characters')
    .regex(/^[\p{L}][\p{L}\s'.-]*$/u, 'State can only contain letters'),
  // No zod default: a schema default makes the parsed input and output types
  // diverge, which react-hook-form's resolver typing rejects. The form seeds it.
  country: z.string().trim().min(2, 'Country is required'),
  // Indian PIN codes are six digits and never start with 0.
  pincode: z.string().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit PIN code'),
  isDefault: z.boolean().optional(),
});

export const newsletterSchema = z.object({
  email: emailSchema,
});

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Coupon codes are at least 3 characters')
    .max(24, 'Coupon codes are at most 24 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'Letters, numbers and hyphens only'),
});

// Free-text delivery instructions on checkout. Optional, but bounded: the field is
// forwarded to the courier, which truncates anything longer.
export const ORDER_NOTES_MAX = 300;

export const orderNotesSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(ORDER_NOTES_MAX, `Keep delivery notes under ${ORDER_NOTES_MAX} characters`)
    .optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Pick a rating').max(5),
  title: z
    .string()
    .trim()
    .min(3, 'Title is required')
    .max(80, 'Keep the title under 80 characters'),
  body: z
    .string()
    .trim()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Keep the review under 1000 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type NewsletterSchema = z.infer<typeof newsletterSchema>;
export type CouponSchema = z.infer<typeof couponSchema>;
export type OrderNotesSchema = z.infer<typeof orderNotesSchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
