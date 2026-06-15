import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { CompanyListByUserIdUseCase } from './CompanyListByUserIdUseCase';

describe('CompanyListByUserIdUseCase', () => {
  it('should be able to list the companies by user id', async () => {
    const companyRepository = new CompanyRepositoryFake();
    const userRepository = new UserRepositoryFake();
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    await companyRepository.create({
      user_id: user.id,
      name: 'Company 1',
    });
    await companyRepository.create({
      user_id: user.id,
      name: 'Company 2',
    });
    const companyListByUserIdUseCase = new CompanyListByUserIdUseCase(
      companyRepository,
    );
    const companies = await companyListByUserIdUseCase.execute(user.id);
    expect(companies.length).toBe(2);
  });
});
