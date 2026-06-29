import { TCompanyCreateInput } from '@/app/dtos/CompanyCreateDTO';
import { Company } from '@/domain/entities/Company';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';
import { AccountCreateUseCase } from '../account/AccountCreateUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

export class CompanyCreateUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private accountRepository: IAccountRepository,
  ) {}

  async execute(input: TCompanyCreateInput): Promise<Company> {
    const company = await this.companyRepository.create(input);
    const accountCreateUseCase = new AccountCreateUseCase(
      this.accountRepository,
    );
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Capital Social',
      group: new AccountGroup('equity'),
      subgroup: new AccountSubgroup(null),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Caixa',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Banco',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Contas a receber',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['accounts_receivable'],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Contas a pagar',
      group: new AccountGroup('liabilities'),
      subgroup: new AccountSubgroup('current_liabilities'),
      tags: ['accounts_payable'],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Cartão de crédito',
      group: new AccountGroup('liabilities'),
      subgroup: new AccountSubgroup('current_liabilities'),
      tags: ['credit_card'],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Receita',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('revenues'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Água',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Aluguel',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Energia',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Gás',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Internet',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Outros',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'Impostos',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('taxes'),
      tags: [],
    });
    return company;
  }
}
