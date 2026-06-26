import { EntryRepositoryFake } from '@/infra/database/repositories/fake/EntryRepositoryFake';
import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { Entry } from '@/domain/entities/Entry';
import { EntryUpdateUseCase } from './EntryUpdateUseCase';
import { EntryCreateUseCase } from './EntryCreateUseCase';

describe('EntryUpdateUseCase', () => {
  it('should be able to update a entry', async () => {
    const userRepository = new UserRepositoryFake();
    const companyRepository = new CompanyRepositoryFake();
    const entryRepository = new EntryRepositoryFake();
    const accountRepository = new AccountRepositoryFake();
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    const company = await companyRepository.create({
      name: 'Company Test',
      user_id: user.id,
    });
    const rentAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Rent',
      group: new AccountGroup('income_statement_accounts'),
      subgroup: new AccountSubgroup('expenses'),
      tags: [],
    });
    const waterAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Water',
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
    const entryUpdateUseCase = new EntryUpdateUseCase(
      entryRepository,
      accountRepository,
    );
    const input = {
      companyId: company.id,
      inclusion: '2026-06-20T00:00:00.000Z',
      debitId: rentAccount.id,
      creditId: creditAccount.id,
      value: 2000.0,
      note: 'Testing',
    };
    const createdEntry = await entryCreateUseCase.execute(input);
    const updatedEntry = await entryUpdateUseCase.execute(createdEntry.id, {
      inclusion: '2026-06-19T00:00:00.000Z',
      debitId: waterAccount.id,
      creditId: creditAccount.id,
      value: 100.12,
      note: '123',
    });

    expect(updatedEntry).toBeInstanceOf(Entry);
    expect(updatedEntry.debit_name).toBe('Water');
    expect(updatedEntry.credit_name).toBe('Bank');
    expect(updatedEntry.value.toString()).toBe('100.12');
    expect(updatedEntry.note).toBe('123');
  });
});
