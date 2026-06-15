import { Company } from '@/domain/entities/Company';
import {
  ICompanyRepository,
  TCreateInput,
  TUpdateInput,
} from '@/domain/repositories/ICompanyRepository';
import { Prisma } from './Prisma';

export class CompanyRepositoryPrisma
  extends Prisma
  implements ICompanyRepository
{
  async findById(id: string): Promise<Company | null> {
    return await this.prisma.company.findFirst({
      where: {
        id,
      },
    });
  }

  async listByUserId(user_id: string): Promise<Company[]> {
    return await this.prisma.company.findMany({
      where: {
        user_id,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async create(input: TCreateInput): Promise<Company> {
    const company = Company.create(input);
    await this.prisma.company.create({
      data: {
        ...company,
      },
    });
    return company;
  }

  async update(id: string, input: TUpdateInput): Promise<Company> {
    const updateCompany = await this.prisma.company.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });

    return new Company(updateCompany);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({
      where: {
        id,
      },
    });
  }
}
