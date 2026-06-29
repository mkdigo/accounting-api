import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { EntryRepositoryFake } from '@/infra/database/repositories/fake/EntryRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { EntryCreateUseCase } from './EntryCreateUseCase';
import { EntryListUseCase } from './EntryListUseCase';

describe('EntryListUseCase', () => {
  it('should be able to list the entries', async () => {
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
    const gasAccount = await accountRepository.create({
      company_id: company.id,
      name: 'Gas',
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
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-06-15T00:00:00.000Z',
      debitId: rentAccount.id,
      creditId: creditAccount.id,
      value: 2000.0,
      note: 'Testing',
    });
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-06-17T00:00:00.000Z',
      debitId: watterAccount.id,
      creditId: creditAccount.id,
      value: 100.0,
      note: 'Testing',
    });
    await entryCreateUseCase.execute({
      companyId: company.id,
      inclusion: '2026-06-20T00:00:00.000Z',
      debitId: gasAccount.id,
      creditId: creditAccount.id,
      value: 200.0,
      note: 'Testing',
    });
    const entryListUseCase = new EntryListUseCase(entryRepository);
    const entries = await entryListUseCase.execute({
      companyId: company.id,
      start: '2026-06-15T00:00:00.000Z',
      end: '2026-06-17T00:00:00.000Z',
      search: '',
    });
    expect(entries.length).toBe(2);
    const entries2 = await entryListUseCase.execute({
      companyId: company.id,
      start: '2026-06-15T00:00:00.000Z',
      end: '2026-06-30T00:00:00.000Z',
      search: 'gas',
    });
    expect(entries2.length).toBe(1);
    const entries3 = await entryListUseCase.execute({
      companyId: company.id,
      start: '2026-06-15T00:00:00.000Z',
      end: '2026-06-30T00:00:00.000Z',
      search: 'test',
    });
    expect(entries3.length).toBe(3);
    const entries4 = await entryListUseCase.execute({
      companyId: '123456',
      start: '2026-06-15T00:00:00.000Z',
      end: '2026-06-30T00:00:00.000Z',
      search: 'test',
    });
    expect(entries4.length).toBe(0);
  });
});
