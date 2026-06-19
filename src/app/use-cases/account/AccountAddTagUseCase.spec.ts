import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { Tag } from '@/domain/entities/Tag';
import { AccountAddTagUseCase } from './AccountAddTagUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { TagName } from '@/domain/value-objects/TagName';
import { Exception } from '@/Exception';

describe('AccountAddTagUseCase', () => {
  it('should be able to add a new tag to an account', async () => {
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
      tags: [],
    });

    const accountAddTagUseCase = new AccountAddTagUseCase(accountRepository);
    const updatedAccount = await accountAddTagUseCase.execute(
      account,
      new TagName('bank'),
    );

    expect(updatedAccount.id).toBe(account.id);
    expect(updatedAccount.group.value).toBe('assets');
    expect(updatedAccount.subgroup.value).toBe('current_assets');
    expect(updatedAccount.tags[0]).toBeInstanceOf(Tag);
    expect(updatedAccount.tags[0].name.value).toBe('bank');
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
    const accountAddTagUseCase = new AccountAddTagUseCase(accountRepository);
    try {
      const account = await accountCreateUseCase.execute({
        company_id: company.id,
        name: 'New Bank',
        group: new AccountGroup('assets'),
        subgroup: new AccountSubgroup('current_assets'),
        tags: ['accounts_receivable'],
      });
      await accountAddTagUseCase.execute(account, new TagName('bank'));
      expect(false).toBe(true);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe(
        'The tag could not be added. Perhaps the tag cannot be added to this subgroup, or the account already has a tag.',
      );
    }
    try {
      const account = await accountCreateUseCase.execute({
        company_id: company.id,
        name: 'New Bank',
        group: new AccountGroup('assets'),
        subgroup: new AccountSubgroup('current_assets'),
        tags: [],
      });
      await accountAddTagUseCase.execute(account, new TagName('credit_card'));
      expect(false).toBe(true);
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
      expect(error.message).toBe(
        'The tag could not be added. Perhaps the tag cannot be added to this subgroup, or the account already has a tag.',
      );
    }
  });
});
