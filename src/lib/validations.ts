import { z } from 'zod'

// User Authentication Schemas
export const loginSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits')
})

export const signupSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be at most 15 digits')
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
})

// Product Schemas
export const createProductSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(70, 'Title must be at most 70 characters')
    .trim(),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must be at most 5000 characters')
    .trim(),
  price: z.number()
    .positive('Price must be greater than 0')
    .max(10000000, 'Price must be less than ₹1,00,00,000'),
  condition: z.enum(['New', 'Used']),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category name too long'),
  subcategory: z.string()
    .min(1, 'Subcategory is required')
    .max(50, 'Subcategory name too long'),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City name too long')
    .regex(/^[a-zA-Z\s]+$/, 'City can only contain letters and spaces'),
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State name too long')
    .regex(/^[a-zA-Z\s]+$/, 'State can only contain letters and spaces'),
  pincode: z.string()
    .length(6, 'Pincode must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Pincode must contain only digits')
})

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long'),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: 'Invalid phone number format'
    }),
  subject: z.enum(['general', 'technical', 'account', 'payment', 'safety', 'business', 'other']),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be at most 1000 characters')
    .trim()
})

// Profile Update Schema
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long'),
  city: z.string()
    .optional()
    .refine((val) => !val || (val.length >= 2 && val.length <= 50 && /^[a-zA-Z\s]+$/.test(val)), {
      message: 'City must be 2-50 characters and contain only letters and spaces'
    }),
  state: z.string()
    .optional()
    .refine((val) => !val || (val.length >= 2 && val.length <= 50 && /^[a-zA-Z\s]+$/.test(val)), {
      message: 'State must be 2-50 characters and contain only letters and spaces'
    }),
  bio: z.string()
    .max(500, 'Bio must be at most 500 characters')
    .optional()
})

// Password Change Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(8, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Fraud Report Schema
export const fraudReportSchema = z.object({
  productId: z.string()
    .min(1, 'Product ID is required')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid product ID format'),
  reason: z.string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must be at most 500 characters')
    .trim()
})

// Support Ticket Schema
export const supportTicketSchema = z.object({
  category: z.enum(['account', 'payment', 'technical', 'listing', 'safety', 'other']),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be at most 2000 characters')
    .trim()
})

// Newsletter Subscription Schema
export const newsletterSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email too long')
})

// File Upload Validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB'
    })
    .refine((file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type), {
      message: 'File must be a valid image (JPEG, PNG, WebP)'
    })
})

// API Response Schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  code: z.string().optional(),
  message: z.string().optional()
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Search and Filter Schemas
export const productSearchSchema = z.object({
  query: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  subcategory: z.string().max(50).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  condition: z.enum(['New', 'Used']).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional()
})

// Rate Limiting Identifiers
export const rateLimitIdentifierSchema = z.object({
  ip: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, 'Invalid IP address'),
  userId: z.string().optional(),
  endpoint: z.string(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
})

// Export validation functions
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, errors: result.error }
  }
}

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
}