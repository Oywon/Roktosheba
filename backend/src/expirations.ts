import { prisma } from './db';

export async function expireStaleDonors() {
  const now = new Date();
  const result = await prisma.donor.updateMany({
    where: {
      expiresAt: { lt: now },
      available: true,
    },
    data: { available: false },
  });
  return result;
}
