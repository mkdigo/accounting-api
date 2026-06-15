import { Company } from '@/domain/entities/Company';

type TOutput = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export class CompanyResource {
  public single(company: Company): TOutput {
    return {
      id: company.id,
      name: company.name,
      created_at: company.created_at.toISOString(),
      updated_at: company.updated_at.toISOString(),
    };
  }

  public collection(companies: Company[]): TOutput[] {
    return companies.map((company) => this.single(company));
  }
}
