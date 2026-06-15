import { CompanyRepositoryFake } from '@/infra/database/repositories/fake/CompanyRepositoryFake';
import { UserRepositoryFake } from '@/infra/database/repositories/fake/UserRepositoryFake';
import { CompanyFindByIdUseCase } from './CompanyFindByIdUseCase';

describe('CompanyFindByIdUseCase', () => {
  it('should be able to find a company by id', async () => {
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
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      companyRepository,
    );
    const foundCompany = await companyFindByIdUseCase.execute(company.id);
    expect(foundCompany?.name).toBe('Company 1');
  });
});
