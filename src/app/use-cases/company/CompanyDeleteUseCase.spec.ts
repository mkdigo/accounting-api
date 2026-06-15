import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { CompanyDeleteUseCase } from './CompanyDeleteUseCase';

describe('CompanyDeleteUseCase', () => {
  it('should be able to delete a company', async () => {
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
    await companyRepository.create({
      user_id: user.id,
      name: 'Company 2',
    });
    const companyDeleteUseCase = new CompanyDeleteUseCase(companyRepository);
    await companyDeleteUseCase.execute(company.id);
    const deletedCompany = await companyRepository.findById(company.id);
    expect(deletedCompany).toBe(null);
  });
});
