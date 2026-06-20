import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { AccountCreateUseCase } from './AccountCreateUseCase';
import { AccountListUseCase } from './AccountListUseCase';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { TagName } from '@/domain/value-objects/TagName';

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
      name: 'Money',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: [],
    });
    await accountCreateUseCase.execute({
      company_id: company1.id,
      name: 'New Bank',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    await accountCreateUseCase.execute({
      company_id: company1.id,
      name: 'New Bank 2',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    await accountCreateUseCase.execute({
      company_id: company1.id,
      name: 'Credit Card',
      group: new AccountGroup('liabilities'),
      subgroup: new AccountSubgroup('current_liabilities'),
      tags: ['credit_card'],
    });
    await accountCreateUseCase.execute({
      company_id: company2.id,
      name: 'New Bank',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
      tags: ['bank'],
    });
    const accountListUseCase = new AccountListUseCase(accountRepository);
    const accounts = await accountListUseCase.execute({
      companyId: company1.id,
    });
    expect(accounts.length).toBe(4);
    const accounts2 = await accountListUseCase.execute({
      companyId: company1.id,
      name: 'bank',
    });
    expect(accounts2.length).toBe(2);
    const accounts3 = await accountListUseCase.execute({
      companyId: company1.id,
      name: 'bank 2',
      group: new AccountGroup('assets'),
      subgroup: new AccountSubgroup('current_assets'),
    });
    expect(accounts3.length).toBe(1);
    const accounts4 = await accountListUseCase.execute({
      companyId: company1.id,
      group: new AccountGroup('liabilities'),
      subgroup: new AccountSubgroup('current_liabilities'),
    });
    expect(accounts4.length).toBe(1);
    const accounts5 = await accountListUseCase.execute({
      companyId: company1.id,
      name: 'test',
    });
    expect(accounts5.length).toBe(0);
    const accounts6 = await accountListUseCase.execute({
      companyId: company1.id,
      tagName: new TagName('credit_card'),
    });
    expect(accounts6.length).toBe(1);
  });
});
