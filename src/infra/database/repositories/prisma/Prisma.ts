import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client';
import { env } from '@/env';

export class Prisma {
  public prisma: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    this.prisma = new PrismaClient({ adapter });
  }
}
