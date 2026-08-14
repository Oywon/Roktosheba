"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
    await Promise.all(organizations.map((org) => prisma.organization.upsert({
        where: { name: org.name },
        update: org,
        create: org,
    })));
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
