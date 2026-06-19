import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { AccountDeleteUseCase } from './AccountDeleteUseCase';

describe('AccountDeleteUseCase', () => {
  it('should be able to delete an account', async () => {
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

    const accountDeleteUseCase = new AccountDeleteUseCase(accountRepository);
    await accountDeleteUseCase.execute(account.id);

    const accountExists = await accountRepository.findById(account.id);
    expect(accountExists).toBe(null);
  });
});
