import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { AccountListUseCase } from './AccountListUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

describe('AccountListUseCase', () => {
  it('should be able to list all company accounts', async () => {
    const userRepository = new UserRepositoryFake();
    const companyRepository = new CompanyRepositoryFake();
    const accountRepository = new AccountRepositoryFake();
    const user = await userRepository.findByUsername('user');
    const company1 = await companyRepository.create({
      name: 'Company Test 1',
      user_id: user!.id,
    });
    const company2 = await companyRepository.create({
      name: 'Company Test 2',
      user_id: user!.id,
    });
    const accountCreateUseCase = new AccountCreateUseCase(accountRepository);
    await accountCreateUseCase.execute({
      company_id: company1.id,
      name: 'New Bank',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    await accountCreateUseCase.execute({
      company_id: company2.id,
      name: 'New Bank',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    const accountListUseCase = new AccountListUseCase(accountRepository);
    const accounts = await accountListUseCase.execute(company1.id);
    expect(accounts.length).toBe(1);
  });
});
