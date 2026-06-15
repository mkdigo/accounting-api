import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';

export class CompanyDeleteUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(companyId: string): Promise<void> {
    await this.companyRepository.delete(companyId);
  }
}
