import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { EntryRepositoryFake } from '@/infra/database/repositories/fake/EntryRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { EntryCreateUseCase } from '../entry/EntryCreateUseCase';
import { BalanceSheetReportUseCase } from './BalanceSheetReportUseCase';

describe('BalanceSheetReportUseCase', () => {
  it('should be able to create a balance sheet report', async () => {
    const userRepository = new UserRepositoryFake();
    const companyRepository = new CompanyRepositoryFake();
    const accountRepository = new AccountRepositoryFake();
    const entryRepository = new EntryRepositoryFake(accountRepository);
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    const company = await companyRepository.create({
      name: 'Company Test',
      user_id: user.id,
    });
    const shareCapitalAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Share Capital',
      group: new AccountGroup('equity'),
      subgroup: new AccountSubgroup(null),
      tags: [],
    });
    const bankAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Bank',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    const revenueAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Revenue',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('revenues'),
      tags: ['bank'],
    });
    const rentAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Rent',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    const watterAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Water',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    const payableAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Payable',
      group: new AccountGroup('liabilities'),
      subgroup: new AccountSubgroup('current_liabilities'),
      tags: [],
    });

    const entryCreateUseCase = new EntryCreateUseCase(
      entryRepository,
      accountRepository,
    );

    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-05-01',
      debitId: bankAccount.id,
      creditId: shareCapitalAccount.id,
      value: 500000.0,
      note: 'Testing',
    });
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-06-01',
      debitId: bankAccount.id,
      creditId: revenueAccount.id,
      value: 100,
      note: 'Testing',
    });
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-07-31',
      debitId: bankAccount.id,
      creditId: revenueAccount.id,
      value: 10_000,
      note: 'Testing',
    });
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-07-31',
      debitId: rentAccount.id,
      creditId: bankAccount.id,
      value: 3_000,
      note: 'Testing',
    });
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-07-31',
      debitId: watterAccount.id,
      creditId: bankAccount.id,
      value: 100.99,
      note: 'Testing',
    });
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-07-31',
      debitId: rentAccount.id,
      creditId: payableAccount.id,
      value: 500.1,
      note: 'Testing',
    });

    const balanceSheetReportUseCase = new BalanceSheetReportUseCase(
      entryRepository,
      accountRepository,
    );
    const result = await balanceSheetReportUseCase.execute({
      companyId: company.id,
      year: 2026,
      month: 7,
    });

    expect(result.balanceSheet.amounts.assets).toBe(506_999.01);
    expect(result.balanceSheet.amounts.currentAssets).toBe(506_999.01);
    expect(result.balanceSheet.amounts.nonCurrentAssets).toBe(0);

    expect(result.balanceSheet.amounts.liabilities).toBe(506_999.01);
    expect(result.balanceSheet.amounts.currentLiabilities).toBe(500.1);
    expect(result.balanceSheet.amounts.nonCurrentLiabilities).toBe(0);
    expect(result.balanceSheet.amounts.equity).toBe(500_000);
    expect(result.balanceSheet.amounts.retainedEarnings).toBe(6_498.91);

    expect(result.incomeStatement.amounts.revenues).toBe(10_000);
    expect(result.incomeStatement.amounts.costs).toBe(0);
    expect(result.incomeStatement.amounts.expenses).toBe(3_601.09);
    expect(result.incomeStatement.amounts.incomeBeforeTaxes).toBe(6_398.91);
    expect(result.incomeStatement.amounts.taxes).toBe(0);
    expect(result.incomeStatement.amounts.incomeAfterTaxes).toBe(6_398.91);
  });
});
