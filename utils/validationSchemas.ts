// Zod Schema Validation for Production Forms
import { z } from 'zod';

export const bdPhoneRegex = /^01[3-9]\d{8}$/;
export const pinRegex = /^\d{4}$/;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(bdPhoneRegex, 'Enter a valid 11-digit BD mobile number (01XXXXXXXXX)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const sendMoneySchema = z.object({
  recipient: z.string().regex(bdPhoneRegex, 'Enter a valid 11-digit BD mobile number (01XXXXXXXXX)'),
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(100, 'Note cannot exceed 100 characters').optional(),
});

export const rechargeSchema = z.object({
  operator: z.enum(['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'], {
    message: 'Please select a valid operator',
  }),
  phone: z.string().regex(bdPhoneRegex, 'Enter a valid 11-digit BD mobile number (01XXXXXXXXX)'),
  amount: z.number().positive('Recharge amount must be greater than 0'),
});

export const cashOutSchema = z.object({
  agentNo: z.string().regex(bdPhoneRegex, 'Enter a valid 11-digit BD agent number (01XXXXXXXXX)'),
  amount: z.number().positive('Cash out amount must be greater than 0'),
});

export const payBillSchema = z.object({
  biller: z.string().min(2, 'Please select a utility biller'),
  accNo: z.string().min(4, 'Account number must be at least 4 digits'),
  amount: z.number().positive('Bill amount must be greater than 0'),
});

export const addMoneySchema = z.object({
  bank: z.string().min(2, 'Please select a bank or card source'),
  amount: z.number().positive('Add amount must be greater than 0'),
});

export const pinSchema = z.object({
  pin: z.string().regex(pinRegex, 'PIN must be exactly 4 numeric digits'),
});
