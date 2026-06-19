import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { Account } from '@/domain/entities/Account';
import { AccountUpdateUseCase } from './AccountUpdateUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

describe('AccountUpdateUseCase', () => {
  it('should be able to update a account', async () => {
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

    const accountUpdateUseCase = new AccountUpdateUseCase(accountRepository);
    const updatedAccount = await accountUpdateUseCase.execute(account.id, {
      name: 'Credit Card',
      group: new AccountGroup('liabilities'),
      subgroup: new AccountSubgroup('current_liabilities'),
    });
    expect(updatedAccount).toBeInstanceOf(Account);
    expect(updatedAccount.id).toBe(account.id);
    expect(updatedAccount.name).toBe('Credit Card');
    expect(updatedAccount.group.value).toBe('liabilities');
    expect(updatedAccount.subgroup.value).toBe('current_liabilities');
  });
});
