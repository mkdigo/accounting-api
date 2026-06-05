import { Prisma } from '@/infra/database/repositories/prisma/Prisma';

(async () => {
  const prisma = new Prisma().prisma;

  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS public CASCADE`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS public`);

  await prisma.$disconnect();
})();
