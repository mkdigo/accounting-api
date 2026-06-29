import { EntryRepositoryFake } from '@/infra/database/repositories/fake/EntryRepositoryFake';
import { EntryCreateUseCase } from './EntryCreateUseCase';
import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { Entry } from '@/domain/entities/Entry';

describe('EntryCreateUseCase', () => {
  it('should be able to create a new entry', async () => {
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
    const debitAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Rent',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    const creditAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Bank',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    const entryCreateUseCase = new EntryCreateUseCase(
      entryRepository,
      accountRepository,
    );
    const input = {
      companyId: company.id,
      inclusion: '2026-06-20T00:00:00.000Z',
      debitId: debitAccount.id,
      creditId: creditAccount.id,
      value: 2000.0,
      note: 'Testing',
    };
    const entry = await entryCreateUseCase.execute(input);
    expect(entry).toBeInstanceOf(Entry);
    expect(entry.debit_name).toBe('Rent');
    expect(entry.credit_name).toBe('Bank');
    expect(entry.value.toNumber()).toBe(2000.0);
  });
});
