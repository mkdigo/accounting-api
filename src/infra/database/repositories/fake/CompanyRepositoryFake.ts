import { Company } from '@/domain/entities/Company';
import {
  ICompanyRepository,
  TCreateInput,
  TUpdateInput,
} from '@/domain/repositories/ICompanyRepository';
import { Exception } from '@/Exception';

export class CompanyRepositoryFake implements ICompanyRepository {
  private companies: Company[] = [];

  async findById(id: string): Promise<Company | null> {
    const filter = this.companies.filter((company) => company.id === id);
    if (filter.length === 0) return null;
    return filter[0];
  }

  async listByUserId(user_id: string): Promise<Company[]> {
    return this.companies.filter((company) => company.user_id === user_id);
  }

  async create(input: TCreateInput): Promise<Company> {
    const company = Company.create(input);
    this.companies.push(company);
    return company;
  }

  async update(id: string, input: TUpdateInput): Promise<Company> {
    const foundCompany = await this.findById(id);
    if (!foundCompany)
      throw new Exception({ code: 404, message: 'Company not found' });
    const updatedCompany = { ...foundCompany, ...input };
    this.companies = this.companies.map((company) => {
      if (company.id === updatedCompany.id) return updatedCompany;
      return company;
    });
    return updatedCompany;
  }

  async delete(id: string): Promise<void> {
    const foundCompany = await this.findById(id);
    if (!foundCompany)
      throw new Exception({ code: 404, message: 'Company not found' });
    this.companies = this.companies.filter((company) => company.id !== id);
  }
}
