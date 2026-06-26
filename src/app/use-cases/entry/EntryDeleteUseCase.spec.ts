import { EntryRepositoryFake } from '@/infra/database/repositories/fake/EntryRepositoryFake';
import { EntryCreateUseCase } from './EntryCreateUseCase';
import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { EntryDeleteUseCase } from './EntryDeleteUseCase';

describe('EntryDeleteUseCase', () => {
  it('should be able to delete a entry', async () => {
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
      value: '2000.00',
      note: 'Testing',
    };
    const entry = await entryCreateUseCase.execute(input);
    const entryDeleteUseCase = new EntryDeleteUseCase(entryRepository);
    await entryDeleteUseCase.execute(entry.id);
    const entries = await entryRepository.list({
      companyId: entry.company_id,
      start: new Date('2026-06-01T00:00:00.000Z'),
      end: new Date('2026-06-30T00:00:00.000Z'),
      search: '',
    });
    expect(entries.length).toBe(0);
  });
});
