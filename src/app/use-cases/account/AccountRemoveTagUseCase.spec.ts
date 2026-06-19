import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { AccountRemoveTagUseCase } from './AccountRemoveTagUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { TagName } from '@/domain/value-objects/TagName';
import { Exception } from '@/Exception';

describe('AccountRemoveTagUseCase', () => {
  it('should be able to remove a tag from an account', async () => {
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

    const accountRemoveTagUseCase = new AccountRemoveTagUseCase(
      accountRepository,
    );
    const updatedAccount = await accountRemoveTagUseCase.execute(
      account,
      new TagName('bank'),
    );

    expect(updatedAccount.id).toBe(account.id);
    expect(updatedAccount.tags.length).toBe(0);
  });

  it('should not be able to remove a non-existent tag', async () => {
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

    const accountRemoveTagUseCase = new AccountRemoveTagUseCase(
      accountRepository,
    );
    try {
      await accountRemoveTagUseCase.execute(
        account,
        new TagName('accounts_receivable'),
      );
      expect(false).toBe(true);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe('Tag not found.');
    }
  });
});
