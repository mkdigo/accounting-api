import { Prisma } from '@/infra/database/repositories/prisma/Prisma';

async function tagsSeed() {
  const prisma = new Prisma().prisma;

  await prisma.tag.createMany({
    data: [
      {
        name: 'bank',
      },
      {
        name: 'accounts_receivable',
      },
      {
        name: 'accounts_payable',
      },
      {
        name: 'credit_card',
      },
    ],
  });

  await prisma.$disconnect();
}

try {
  (async () => {
    await tagsSeed();
    console.info('\x1b[32m%s\x1b[0m', 'Tags successfully seeded.');
  })();
} catch (erro: any) {
  console.error('❌ Error seeding tags', erro.message);
}
