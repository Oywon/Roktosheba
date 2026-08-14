import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const organizations = [
    {
      name: 'Badhan',
      founded: '1997',
      description: 'Student-run blood donation organization with chapters across Bangladesh.',
      websiteUrl: 'https://badhan.org',
    },
    {
      name: 'Sandhani',
      founded: '1977',
      description: 'Medical students and public health volunteers organizing blood donation drives.',
      websiteUrl: 'https://sandhani.org.bd',
    },
    {
      name: 'Quantum Foundation',
      founded: '2019',
      description: 'Non-profit coordinating blood donation logistics and urgent help.',
      websiteUrl: 'https://quantumfoundation.org',
    },
    {
      name: 'Bangladesh Red Crescent Society',
      founded: '1973',
      description: 'Humanitarian organization offering blood donation services and emergency support.',
      websiteUrl: 'https://www.bdrcs.org',
    },
    {
      name: 'Badhon Foundation',
      founded: '2007',
      description: 'Blood donation network that raises awareness and maintains donor records.',
      websiteUrl: 'https://badhonfoundation.org',
    },
    {
      name: 'Blood Donation Bangladesh Welfare Foundation',
      founded: '2014',
      description: 'Community organization helping people find donors and manage urgent blood needs.',
      websiteUrl: 'https://blooddonationbd.com',
    },
  ];

  for (const org of organizations) {
    const exists = await prisma.organization.findUnique({ where: { name: org.name } });
    if (!exists) {
      await prisma.organization.create({ data: org });
    }
  }
}

main()
  .then(() => {
    console.log('Seed complete');
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    prisma.$disconnect();
    process.exit(1);
  });
