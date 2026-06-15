import { TCompanyCreateInput } from '@/app/dtos/CompanyCreateDTO';
import { Company } from '@/domain/entities/Company';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';

export class CompanyCreateUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(input: TCompanyCreateInput): Promise<Company> {
    const company = await this.companyRepository.create(input);
    return company;
  }
}
