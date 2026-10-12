import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { json } from 'body-parser';
import { Prisma } from '@prisma/client';
import { prisma } from './db';
import { asyncHandler, createJwt, verifyJwt, sanitizePhone, validateBody, validatePhone, sendJson } from './utils';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(helmet());
app.use(json());

const otpStore = new Map<string, { code: string; expiresAt: number }>();
const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();
const donorContactRequestLimitStore = new Map<string, { count: number; expiresAt: number }>();

const requestOtpSchema = z.object({ phone: z.string().min(8) });
const verifyOtpSchema = z.object({ phone: z.string().min(8), code: z.string().min(4).max(6), purpose: z.enum(['donor', 'request', 'edit']) });
const donorCreateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  bloodGroup: z.enum(['A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS', 'O_PLUS', 'O_MINUS']),
  district: z.string().min(2),
  area: z.string().min(2).optional(),
  lastDonation: z.string().optional(),
  age: z.coerce.number().int().min(18).max(80).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).optional(),
  available: z.boolean().optional(),
  consent: z.boolean().default(false),
  verificationToken: z.string().optional(),
});
const donorEditSchema = z.object({
  name: z.string().min(2).optional(),
  bloodGroup: z.enum(['A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS', 'O_PLUS', 'O_MINUS']).optional(),
  district: z.string().min(2).optional(),
  area: z.string().optional(),
  lastDonation: z.string().optional(),
  available: z.boolean().optional(),
  verificationToken: z.string(),
});
const requestCreateSchema = z.object({
  bloodGroup: z.enum(['A_PLUS', 'A_MINUS', 'B_PLUS', 'B_MINUS', 'AB_PLUS', 'AB_MINUS', 'O_PLUS', 'O_MINUS']),
  hospital: z.string().min(2),
  district: z.string().min(2),
  contactPhone: z.string().min(8),
  unitsNeeded: z.string().optional(),
  note: z.string().optional(),
});

const rateLimit = (key: string, limit = 10, windowSeconds = 60) => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.expiresAt < now) {
    rateLimitStore.set(key, { count: 1, expiresAt: now + windowSeconds * 1000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  rateLimitStore.set(key, entry);
  return true;
};

const dailyRateLimit = (key: string, limit = 5, windowMs = 24 * 60 * 60 * 1000) => {
  const now = Date.now();
  const entry = donorContactRequestLimitStore.get(key);
  if (!entry || entry.expiresAt < now) {
    donorContactRequestLimitStore.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  donorContactRequestLimitStore.set(key, entry);
  return true;
};

const logOtpSend = (phone: string, code: string) => {
  console.log(`[OTP] send to ${phone}: ${code}`);
};

app.post('/api/otp/request', asyncHandler(async (req, res) => {
  const body = validateBody(requestOtpSchema, req.body);
  const phone = sanitizePhone(body.phone);

  if (!validatePhone(phone)) {
    return sendJson(res, { success: false, error: 'Invalid Bangladeshi phone' });
  }

  const clientIp = req.ip;
  const rateKey = `otp:${clientIp}:${phone}`;
  if (!rateLimit(rateKey, 5, 300)) {
    return res.status(429).json({ success: false, error: 'Too many OTP requests' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, { code, expiresAt: Date.now() + Number(process.env.OTP_CODE_TTL_SECONDS || 900) * 1000 });
  logOtpSend(phone, code);

  return sendJson(res, { success: true, data: { message: 'OTP sent to phone' } });
}));

app.post('/api/otp/verify', asyncHandler(async (req, res) => {
  const body = validateBody(verifyOtpSchema, req.body);
  const phone = sanitizePhone(body.phone);
  const stored = otpStore.get(phone);

  if (!stored || stored.code !== body.code || stored.expiresAt < Date.now()) {
    return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
  }

  const token = createJwt({ phone, purpose: body.purpose }, '15m');
  otpStore.delete(phone);
  return sendJson(res, { success: true, data: { verificationToken: token } });
}));

app.get('/api/organizations', asyncHandler(async (req, res) => {
  const organizations = await prisma.organization.findMany({ orderBy: { name: 'asc' } });
  return sendJson(res, { success: true, data: organizations });
}));

app.get('/api/donors', asyncHandler(async (req, res) => {
  const filters = req.query;
  const where: any = { available: true };

  if (filters.bloodGroup) where.bloodGroup = filters.bloodGroup;
  if (filters.district) where.district = filters.district;
  if (filters.area) {
    where.area = { contains: String(filters.area) };
  }

  const donors = await prisma.donor.findMany({ where, orderBy: [{ available: 'desc' }, { createdAt: 'desc' }] });
  return sendJson(res, { success: true, data: donors.map((donor) => ({
    id: donor.id,
    name: donor.name,
    bloodGroup: donor.bloodGroup,
    district: donor.district,
    area: donor.area,
    available: donor.available,
    lastDonation: donor.lastDonation ? donor.lastDonation.toISOString() : null,
    age: donor.age,
    gender: donor.gender,
    consent: donor.consent,
    createdAt: donor.createdAt,
    updatedAt: donor.updatedAt,
  })) });
}));

app.post('/api/donors', asyncHandler(async (req, res) => {
  const body = validateBody(donorCreateSchema, req.body);
  const phone = sanitizePhone(body.phone);
  if (!validatePhone(phone)) {
    return res.status(400).json({ success: false, error: 'Invalid Bangladeshi phone number' });
  }

  if (body.verificationToken) {
    const token = verifyJwt<{ phone: string; purpose: 'donor' | 'request' | 'edit' }>(body.verificationToken);
    if (token.purpose !== 'donor' || token.phone !== phone) {
      return res.status(403).json({ success: false, error: 'Verification token mismatch' });
    }
  }

  if (!body.consent) {
    return res.status(400).json({ success: false, error: 'You must consent before registering as a donor.' });
  }

  const existingDonor = await prisma.donor.findUnique({ where: { phone } });
  if (existingDonor) {
    return res.status(409).json({
      success: false,
      error: 'This phone number is already registered as a donor. Please update your existing listing instead.',
    });
  }

  const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  let donor;
  try {
    donor = await prisma.donor.create({ data: {
      name: body.name,
      phone,
      bloodGroup: body.bloodGroup,
      district: body.district as any,
      area: body.area,
      lastDonation: body.lastDonation ? new Date(body.lastDonation) : null,
      age: body.age,
      gender: body.gender,
      available: body.available ?? true,
      consent: body.consent,
      expiresAt,
    }});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'This phone number is already registered as a donor. Please update your existing listing instead.',
      });
    }
    throw error;
  }

  return sendJson(res, { success: true, data: { id: donor.id, message: 'Donor registered successfully' } });
}));

app.patch('/api/donors/:id', asyncHandler(async (req, res) => {
  const donorId = req.params.id;
  const body = validateBody(donorEditSchema, req.body);
  const token = verifyJwt<{ phone: string; purpose: 'donor' | 'request' | 'edit' }>(body.verificationToken);

  const donor = await prisma.donor.findUnique({ where: { id: donorId } });
  if (!donor) {
    return res.status(404).json({ success: false, error: 'Donor not found' });
  }
  if (donor.phone !== token.phone) {
    return res.status(403).json({ success: false, error: 'Verification token does not match donor phone' });
  }

  const update = {
    name: body.name ?? donor.name,
    bloodGroup: body.bloodGroup ?? donor.bloodGroup,
    district: body.district ? (body.district as any) : donor.district,
    area: body.area ?? donor.area,
    lastDonation: body.lastDonation ? new Date(body.lastDonation) : donor.lastDonation,
    available: body.available ?? donor.available,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  };

  const updated = await prisma.donor.update({ where: { id: donorId }, data: update });
  return sendJson(res, { success: true, data: { id: updated.id } });
}));

app.delete('/api/donors/:id', asyncHandler(async (req, res) => {
  const donorId = req.params.id;
  const { verificationToken } = req.body;
  if (!verificationToken) {
    return res.status(400).json({ success: false, error: 'Missing verification token' });
  }

  const token = verifyJwt<{ phone: string; purpose: 'donor' | 'request' | 'edit' }>(verificationToken);
  const donor = await prisma.donor.findUnique({ where: { id: donorId } });
  if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });
  if (donor.phone !== token.phone) {
    return res.status(403).json({ success: false, error: 'Verification token does not match donor phone' });
  }

  await prisma.donor.delete({ where: { id: donorId } });
  return sendJson(res, { success: true, data: { id: donorId } });
}));

app.get('/api/contact-requests', asyncHandler(async (req, res) => {
  const authorization = req.header('Authorization');
  const verificationToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!verificationToken) {
    return res.status(401).json({ success: false, error: 'Phone verification is required' });
  }

  const token = verifyJwt<{ phone: string; purpose: 'donor' | 'request' | 'edit' }>(verificationToken);
  const donorPhone = req.query.donorPhone ? sanitizePhone(String(req.query.donorPhone)) : null;
  const requesterPhone = req.query.requesterPhone ? sanitizePhone(String(req.query.requesterPhone)) : null;

  const where: any = {};
  if (donorPhone) {
    if (token.purpose !== 'donor' || token.phone !== donorPhone) {
      return res.status(403).json({ success: false, error: 'Verification token does not match donor phone' });
    }
    where.donor = { phone: donorPhone };
  } else if (requesterPhone) {
    if (token.purpose !== 'request' || token.phone !== requesterPhone) {
      return res.status(403).json({ success: false, error: 'Verification token does not match requester phone' });
    }
    where.requesterPhone = requesterPhone;
  } else {
    return res.status(400).json({ success: false, error: 'A verified phone number is required' });
  }

  const requests = await prisma.donorContactRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { donor: true },
  });

  return sendJson(res, { success: true, data: requests.map((request) => ({
    id: request.id,
    donorId: request.donorId,
    donorName: request.donorName ?? request.donor.name,
    requesterName: request.requesterName,
    requesterPhone: request.requesterPhone,
    requesterMessage: request.requesterMessage,
    donorPhone: request.status === 'ACCEPTED' ? request.donor.phone : null,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  })) });
}));

app.post('/api/donors/:id/contact-requests', asyncHandler(async (req, res) => {
  const donorId = req.params.id;
  const body = z.object({
    requesterName: z.string().min(2),
    requesterPhone: z.string().min(8),
    message: z.string().min(10).max(500).optional(),
  }).parse(req.body);

  const requesterPhone = sanitizePhone(body.requesterPhone);
  if (!validatePhone(requesterPhone)) {
    return res.status(400).json({ success: false, error: 'Invalid requester phone number' });
  }

  const donor = await prisma.donor.findUnique({ where: { id: donorId } });
  if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });

  const limitKey = `contact-request:${requesterPhone}`;
  if (!dailyRateLimit(limitKey, 5, 24 * 60 * 60 * 1000)) {
    return res.status(429).json({ success: false, error: 'Too many contact requests today. Please try again tomorrow.' });
  }

  const request = await prisma.donorContactRequest.create({
    data: {
      donorId: donor.id,
      donorName: donor.name,
      requesterName: body.requesterName,
      requesterPhone,
      requesterMessage: body.message || null,
      status: 'PENDING',
    },
  });

  return sendJson(res, { success: true, data: { id: request.id, status: request.status, message: 'Contact request sent to donor' } });
}));

app.patch('/api/contact-requests/:id/respond', asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const body = z.object({
    donorPhone: z.string().min(8),
    status: z.enum(['ACCEPTED', 'DECLINED']),
    verificationToken: z.string(),
  }).parse(req.body);

  const donorPhone = sanitizePhone(body.donorPhone);
  const token = verifyJwt<{ phone: string; purpose: 'donor' | 'request' | 'edit' }>(body.verificationToken);
  if (token.purpose !== 'donor' || token.phone !== donorPhone) {
    return res.status(403).json({ success: false, error: 'Verification token does not match donor phone' });
  }

  const donor = await prisma.donor.findUnique({ where: { phone: donorPhone } });
  if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });

  const existing = await prisma.donorContactRequest.findUnique({ where: { id: requestId } });
  if (!existing) return res.status(404).json({ success: false, error: 'Contact request not found' });
  if (existing.donorId !== donor.id) {
    return res.status(403).json({ success: false, error: 'This donor cannot respond to that request' });
  }

  const updated = await prisma.donorContactRequest.update({
    where: { id: requestId },
    data: {
      status: body.status,
      donorPhone: body.status === 'ACCEPTED' ? donor.phone : null,
      donorPhoneVisible: body.status === 'ACCEPTED',
      requesterPhoneVisible: true,
    },
    include: { donor: true },
  });

  return sendJson(res, { success: true, data: {
    id: updated.id,
    donorId: updated.donorId,
    donorName: updated.donorName ?? donor.name,
    requesterName: updated.requesterName,
    requesterPhone: updated.requesterPhone,
    donorPhone: updated.status === 'ACCEPTED' ? donor.phone : null,
    status: updated.status,
  }});
}));

app.get('/api/requests', asyncHandler(async (req, res) => {
  const fulfilled = req.query.fulfilled === 'true';
  const requests = await prisma.emergencyRequest.findMany({
    where: { fulfilled },
    orderBy: { createdAt: 'desc' },
  });
  return sendJson(res, { success: true, data: requests });
}));

app.post('/api/requests', asyncHandler(async (req, res) => {
  const body = validateBody(requestCreateSchema, req.body);
  const contactPhone = sanitizePhone(body.contactPhone);
  if (!validatePhone(contactPhone)) {
    return res.status(400).json({ success: false, error: 'Invalid Bangladeshi phone number' });
  }

  const request = await prisma.emergencyRequest.create({ data: {
    bloodGroup: body.bloodGroup,
    hospital: body.hospital,
    district: body.district as any,
    contactPhone,
    unitsNeeded: body.unitsNeeded,
    note: body.note,
  }});

  return sendJson(res, { success: true, data: { id: request.id } });
}));

app.patch('/api/requests/:id/fulfill', asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const { verificationToken } = req.body;
  if (!verificationToken) {
    return res.status(400).json({ success: false, error: 'Missing verification token' });
  }

  const token = verifyJwt<{ phone: string; purpose: 'donor' | 'request' | 'edit' }>(verificationToken);
  const request = await prisma.emergencyRequest.findUnique({ where: { id: requestId } });
  if (!request) return res.status(404).json({ success: false, error: 'Request not found' });
  if (request.contactPhone !== token.phone) {
    return res.status(403).json({ success: false, error: 'Verification token does not match request phone' });
  }

  const updated = await prisma.emergencyRequest.update({ where: { id: requestId }, data: { fulfilled: true } });
  return sendJson(res, { success: true, data: { id: updated.id } });
}));

app.post('/api/donors/:id/report', asyncHandler(async (req, res) => {
  const donorId = req.params.id;
  const donor = await prisma.donor.findUnique({ where: { id: donorId } });
  if (!donor) return res.status(404).json({ success: false, error: 'Donor not found' });
  await prisma.donor.update({ where: { id: donorId }, data: { reports: donor.reports + 1 } });
  return sendJson(res, { success: true, data: { message: 'Report received' } });
}));

app.post('/api/requests/:id/report', asyncHandler(async (req, res) => {
  const requestId = req.params.id;
  const emergencyRequest = await prisma.emergencyRequest.findUnique({ where: { id: requestId } });
  if (!emergencyRequest) return res.status(404).json({ success: false, error: 'Request not found' });
  await prisma.emergencyRequest.update({ where: { id: requestId }, data: { reports: emergencyRequest.reports + 1 } });
  return sendJson(res, { success: true, data: { message: 'Report received' } });
}));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  return res.status(500).json({ success: false, error: err.message ?? 'Internal server error' });
});

export default app;
