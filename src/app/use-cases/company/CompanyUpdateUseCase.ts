import { TCompanyUpdateInput } from '@/app/dtos/CompanyUpdateDTO';
import { Company } from '@/domain/entities/Company';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';

export class CompanyUpdateUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(
    companyId: string,
    input: TCompanyUpdateInput,
  ): Promise<Company> {
    return await this.companyRepository.update(companyId, input);
  }
}
