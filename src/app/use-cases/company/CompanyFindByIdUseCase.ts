import { Company } from '@/domain/entities/Company';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';

export class CompanyFindByIdUseCase {
  constructor(private companyReposiroty: ICompanyRepository) {}

  async execute(id: string): Promise<Company | null> {
    return await this.companyReposiroty.findById(id);
  }
}
