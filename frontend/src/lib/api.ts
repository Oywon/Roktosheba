import { BloodGroup, ContactRequest, District, Donor, EmergencyRequest, Organization } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const parseJson = async (response: Response) => {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'API error');
  }
  return payload.data;
};

const defaultHeaders = { 'Content-Type': 'application/json' };

export const requestOtp = async (phone: string) => {
  return fetch(`${API_BASE}/otp/request`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ phone }),
  }).then(parseJson);
};

export const verifyOtp = async (phone: string, code: string, purpose: 'donor' | 'request' | 'edit') => {
  return fetch(`${API_BASE}/otp/verify`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ phone, code, purpose }),
  }).then(parseJson) as Promise<{ verificationToken: string }>;
};

export const fetchDonors = async (params: { bloodGroup?: BloodGroup; district?: District; area?: string }) => {
  const query = new URLSearchParams();
  if (params.bloodGroup) query.set('bloodGroup', params.bloodGroup);
  if (params.district) query.set('district', params.district);
  if (params.area) query.set('area', params.area);
  return fetch(`${API_BASE}/donors?${query.toString()}`).then(parseJson) as Promise<Donor[]>;
};

export const createDonor = async (payload: {
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  district: District;
  area?: string;
  lastDonation?: string;
  available: boolean;
  age?: number;
  gender?: string;
  consent: boolean;
  verificationToken?: string;
}) => {
  return fetch(`${API_BASE}/donors`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  }).then(parseJson);
};

export const createDonorContactRequest = async (payload: {
  donorId: string;
  requesterName: string;
  requesterPhone: string;
  message: string;
}) => {
  return fetch(`${API_BASE}/donors/${payload.donorId}/contact-requests`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  }).then(parseJson) as Promise<{ id: string; status: string; message: string }>;
};

export const respondToContactRequest = async (
  requestId: string,
  donorPhone: string,
  status: 'ACCEPTED' | 'DECLINED',
  verificationToken: string,
) => {
  return fetch(`${API_BASE}/contact-requests/${requestId}/respond`, {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({ donorPhone, status, verificationToken }),
  }).then(parseJson) as Promise<ContactRequest & { donorPhone?: string | null; requesterPhone?: string | null }>;
};

export const fetchContactRequestsForDonor = async (donorPhone: string, verificationToken: string) => {
  return fetch(`${API_BASE}/contact-requests?donorPhone=${encodeURIComponent(donorPhone)}`, {
    headers: { Authorization: `Bearer ${verificationToken}` },
  }).then(parseJson) as Promise<ContactRequest[]>;
};

export const reportDonor = async (donorId: string) => {
  return fetch(`${API_BASE}/donors/${donorId}/report`, {
    method: 'POST',
    headers: defaultHeaders,
  }).then(parseJson);
};

export const fetchRequests = async (fulfilled = false) => {
  const query = new URLSearchParams({ fulfilled: String(fulfilled) });
  return fetch(`${API_BASE}/requests?${query}`).then(parseJson) as Promise<EmergencyRequest[]>;
};

export const createRequest = async (payload: {
  bloodGroup: BloodGroup;
  hospital: string;
  district: District;
  contactPhone: string;
  unitsNeeded?: string;
  note?: string;
}) => {
  return fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(payload),
  }).then(parseJson);
};

export const fetchOrganizations = async () => {
  return fetch(`${API_BASE}/organizations`).then(parseJson) as Promise<Organization[]>;
};
