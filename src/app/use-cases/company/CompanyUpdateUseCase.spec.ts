import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { CompanyUpdateUseCase } from './CompanyUpdateUseCase';

describe('CompanyUpdateUseCase', () => {
  it('should be able to update a company', async () => {
    const companyRepository = new CompanyRepositoryFake();
    const userRepository = new UserRepositoryFake();
    const user = await userRepository.findByUsername('user');
    if (!user) {
      expect(false).toBe(true);
      return;
    }
    const company = await companyRepository.create({
      user_id: user.id,
      name: 'Company 1',
    });
    const companyUpdateUseCase = new CompanyUpdateUseCase(companyRepository);
    const foundCompany = await companyUpdateUseCase.execute(company.id, {
      name: 'New Name',
    });
    expect(foundCompany.name).toBe('New Name');
  });
});
