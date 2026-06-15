import { Company } from '@/domain/entities/Company';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';

export class CompanyListByUserIdUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(userId: string): Promise<Company[]> {
    return await this.companyRepository.listByUserId(userId);
  }
}
