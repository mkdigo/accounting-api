import { Factory } from './Factory';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ICodeRepository } from '@/domain/repositories/ICodeRepository';
import { UserRepositoryPrisma } from '../database/repositories/prisma/UserRepositoryPrisma';
import { CodeRepositoryPrisma } from '../database/repositories/prisma/CodeRepositoryPrisma';
import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { TokenRepositoryPrisma } from '../database/repositories/prisma/TokenRepositoryPrisma';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';
import { CompanyRepositoryPrisma } from '../database/repositories/prisma/CompanyRepositoryPrisma';

export class RepositoryFactory extends Factory {
  public static getUserRepository(): IUserRepository {
    return this.make('userRepository', UserRepositoryPrisma);
  }

  public static getCodeRepository(): ICodeRepository {
    return this.make('codeRepository', CodeRepositoryPrisma);
  }

  public static getTokenRepository(): ITokenRepository {
    return this.make('tokenRepository', TokenRepositoryPrisma);
  }

  public static getCompanyRepository(): ICompanyRepository {
    return this.make('companyRepository', CompanyRepositoryPrisma);
  }
}
