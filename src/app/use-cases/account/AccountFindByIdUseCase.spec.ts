import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { AccountFindByIdUseCase } from './AccountFindByIdUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

describe('AccountFindByIdUseCase', () => {
  it('should be able to find an account by id', async () => {
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

    const accountFindByIdUseCase = new AccountFindByIdUseCase(
      accountRepository,
    );
    const foundAccount = await accountFindByIdUseCase.execute(account.id);
    expect(foundAccount).toMatchObject(account);
    expect(foundAccount?.id).toBe(account.id);
  });
});
