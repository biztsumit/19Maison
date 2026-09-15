import { z } from 'zod';

// E.164 phone format: +[country_code][number]  e.g. +919876543210
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

// POST /auth/login  { phone, password }
export const loginSchema = z.object({
  phone: phoneE164Schema,
  password: z.string().min(1, 'Password is required'),
});

// POST /auth/register  { firstName, lastName, phone, email?, password }
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name min 2 chars').max(50, 'Too long'),
  lastName: z.string().min(2, 'Last name min 2 chars').max(50, 'Too long'),
  phone: phoneE164Schema,
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  password: passwordSchema,
});

// POST /auth/verify-otp (phone is in Redux pendingPhone)
export const otpSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code').regex(/^\d{6}$/, 'Digits only'),
});

export const forgotPasswordSchema = z.object({
  phone: phoneE164Schema,
});

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: phoneE164Schema,
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  country: z.string().default('India'),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title is required'),
  body: z.string().min(10, 'Review must be at least 10 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
