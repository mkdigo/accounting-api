import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { CompanyCreateUseCase } from './CompanyCreateUseCase';
import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { AccountRepositoryFake } from '@/infra/database/repositories/fake/AccountRepositoryFake';

describe('CompanyCreateUseCase', () => {
  it('should be able to create a new company', async () => {
    const userRepository = new UserRepositoryFake();
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    const input = {
      user_id: user.id,
      name: 'New Company',
    };
    const companyRepository = new CompanyRepositoryFake();
    const accountRepository = new AccountRepositoryFake();
    const companyCreateUseCase = new CompanyCreateUseCase(
      companyRepository,
      accountRepository,
    );
    const company = await companyCreateUseCase.execute(input);
    expect(company).toMatchObject(input);

    const accounts = await accountRepository.list(company.id);
    expect(accounts.length).toBe(12);
  });
});
