export type VerificationTokenPayload = {
  phone: string;
  purpose: 'donor' | 'request' | 'edit';
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
