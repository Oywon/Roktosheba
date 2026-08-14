import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ZodError, z } from 'zod';

const PHONE_REGEX = /^(\+88)?01[3-9]\d{8}$/;

export const validatePhone = (phone: string) => PHONE_REGEX.test(phone);

export const sanitizePhone = (phone: string) => {
  const digits = phone.replace(/[^0-9+]/g, '');
  if (digits.startsWith('88') && !digits.startsWith('+')) {
    return `+${digits}`;
  }
  if (digits.startsWith('0')) {
    return `+88${digits.slice(1)}`;
  }
  return digits;
};

export const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var ${key}`);
  }
  return value;
};

export const sendJson = <T>(res: Response, payload: { success: boolean; data?: T; error?: string }) => {
  res.json(payload);
};

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export const createJwt = (payload: object, expiresIn = '15m') => {
  const secret = requireEnv('JWT_SECRET');
  return jwt.sign(payload as any, secret as any, { expiresIn } as any);
};

export const verifyJwt = <T>(token: string): T => {
  const secret = requireEnv('JWT_SECRET');
  return jwt.verify(token, secret as any) as T;
};

export const validateBody = <T>(schema: z.ZodSchema<T>, body: unknown): T => {
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; '));
    }
    throw error;
  }
};
