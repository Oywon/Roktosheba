import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const organizations = [
    {
      name: 'Badhan',
      founded: '1997',
      description: 'Student-run blood donation network with community emergency support across Bangladesh.',
      websiteUrl: 'https://badhan.org',
      contactPhone: 'Phone: to be verified',
    },
    {
      name: 'Sandhani',
      founded: '1977',
      description: 'Voluntary blood donation organization run by medical and dental students with public donation drives.',
      websiteUrl: 'https://sandhani.org.bd',
      contactPhone: 'Phone: to be verified',
    },
    {
      name: 'Quantum Foundation',
      founded: '2019',
      description: 'Volunteer-led blood donation program supporting urgent donor coordination and public awareness.',
      websiteUrl: 'https://quantumfoundation.org',
      contactPhone: 'Phone: to be verified',
    },
    {
      name: 'Bangladesh Red Crescent Society',
      founded: '1973',
      description: 'Humanitarian organization offering blood donation services and emergency health support.',
      websiteUrl: 'https://www.bdrcs.org',
      contactPhone: 'Phone: to be verified',
    },
    {
      name: 'Police Blood Bank',
      founded: '1990s',
      description: 'Emergency blood bank service for police and public emergency support, with local coordination roles.',
      websiteUrl: 'https://www.police.gov.bd',
      contactPhone: 'Phone: to be verified',
    },
    {
      name: 'Badhon Foundation',
      founded: '2007',
      description: 'Volunteer-led donor mobilization network with awareness campaigns and emergency blood support.',
      websiteUrl: 'https://badhonfoundation.org',
      contactPhone: 'Phone: to be verified',
    },
    {
      name: 'Blood Donation Bangladesh Welfare Foundation',
      founded: '2014',
      description: 'Community-based organization helping people find donors and support urgent blood requests.',
      websiteUrl: 'https://blooddonationbd.com',
      contactPhone: 'Phone: to be verified',
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
