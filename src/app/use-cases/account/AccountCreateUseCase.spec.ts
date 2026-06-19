import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { Account } from '@/domain/entities/Account';
import { Tag } from '@/domain/entities/Tag';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { Exception } from '@/Exception';

describe('AccountCreateUseCase', () => {
  it('should be able to create a new account', async () => {
    const userRepository = new UserRepositoryFake();
    const companyRepository = new CompanyRepositoryFake();
    const accountRepository = new AccountRepositoryFake();
    const user = await userRepository.findByUsername('user');
    const company = await companyRepository.create({
      name: 'Company Test',
      user_id: user!.id,
    });
    const accountCreateUseCase = new AccountCreateUseCase(accountRepository);
    const account = await accountCreateUseCase.execute({
      company_id: company.id,
      name: 'New Bank',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    expect(account).toBeInstanceOf(Account);
    expect(account.name).toBe('New Bank');
    expect(account.group.value).toBe('assets');
    expect(account.subgroup.value).toBe('current_assets');
    expect(account.tags[0]).toBeInstanceOf(Tag);
    expect(account.tags[0].name.value).toBe('bank');
  });

  it('should not be able to add two tags or an invalid tag', async () => {
    const userRepository = new UserRepositoryFake();
    const companyRepository = new CompanyRepositoryFake();
    const accountRepository = new AccountRepositoryFake();
    const user = await userRepository.findByUsername('user');
    const company = await companyRepository.create({
      name: 'Company Test',
      user_id: user!.id,
    });
    const accountCreateUseCase = new AccountCreateUseCase(accountRepository);
    try {
      await accountCreateUseCase.execute({
        company_id: company.id,
        name: 'New Bank',
        group: new AccountGroup('assets'),
        subgroup: new AccountSubgroup('current_assets'),
        tags: ['bank', 'accounts_receivable'],
      });
      expect(false).toBe(true);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe('It is not possible to add two tags.');
    }
    try {
      await accountCreateUseCase.execute({
        company_id: company.id,
        name: 'New Bank',
        group: new AccountGroup('assets'),
        subgroup: new AccountSubgroup('current_assets'),
        tags: ['credit_card'],
      });
      expect(false).toBe(true);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe('Invalid tag credit_card.');
    }
  });
});
