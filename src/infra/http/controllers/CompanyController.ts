import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';
import { TReply, TRequest } from '../HttpServer';
import { RepositoryFactory } from '@/infra/factories/RepositoryFactory';
import { CompanyListByUserIdUseCase } from '@/app/use-cases/company/CompanyListByUserIdUseCase';
import { CompanyPolicy } from '../policies/CompanyPolicy';
import { CompanyResource } from '../resources/CompanyResource';
import { CompanyFindByIdUseCase } from '@/app/use-cases/company/CompanyFindByIdUseCase';
import {
  TCompanyCreateBody,
  TCompanyFindByIdParams,
  TCompanyUpdateBody,
  TCompanyUpdateParams,
} from '../validators/zod/CompanySchemas';
import { Exception } from '@/Exception';
import { CompanyCreateUseCase } from '@/app/use-cases/company/CompanyCreateUseCase';
import { CompanyUpdateUseCase } from '@/app/use-cases/company/CompanyUpdateUseCase';
import { CompanyDeleteUseCase } from '@/app/use-cases/company/CompanyDeleteUseCase';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';

export class CompanyController {
  private companyRepository: ICompanyRepository;
  private companyResource: CompanyResource;
  private accountRepository: IAccountRepository;

  constructor() {
    this.companyRepository = RepositoryFactory.getCompanyRepository();
    this.companyResource = new CompanyResource();
    this.accountRepository = RepositoryFactory.getAccountRepository();
  }

  public listByUserId = async (request: TRequest, reply: TReply) => {
    CompanyPolicy.listByUserId(request);
    const companyListByUserIdUseCase = new CompanyListByUserIdUseCase(
      this.companyRepository,
    );
    const companies = await companyListByUserIdUseCase.execute(
      request.auth!.user.id,
    );
    reply.send({
      companies: this.companyResource.collection(companies),
    });
  };

  public findById = async (
    request: TRequest<{ Params: TCompanyFindByIdParams }>,
    reply: TReply,
  ) => {
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const { companyId } = request.params;
    const company = await companyFindByIdUseCase.execute(companyId);
    if (!company)
      throw new Exception({
        code: 404,
        message: 'Company not found.',
      });
    CompanyPolicy.findById(request, company);
    reply.send({
      company: this.companyResource.single(company),
    });
  };

  public create = async (
    request: TRequest<{ Body: TCompanyCreateBody }>,
    reply: TReply,
  ) => {
    CompanyPolicy.create(request);
    const input = request.body;
    const companyCreateUseCase = new CompanyCreateUseCase(
      this.companyRepository,
      this.accountRepository,
    );
    const company = await companyCreateUseCase.execute({
      name: input.name,
      user_id: request.auth!.user.id,
    });
    reply.code(201).send({
      company: this.companyResource.single(company),
    });
  };

  public update = async (
    request: TRequest<{
      Body: TCompanyUpdateBody;
      Params: TCompanyUpdateParams;
    }>,
    reply: TReply,
  ) => {
    const input = request.body;
    const { companyId } = request.params;
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(companyId);
    if (!company)
      throw new Exception({
        code: 404,
        message: 'Company not found',
      });
    CompanyPolicy.update(request, company);
    const companyUpdateUseCase = new CompanyUpdateUseCase(
      this.companyRepository,
    );
    const updatedCompany = await companyUpdateUseCase.execute(companyId, input);
    reply.send({
      company: this.companyResource.single(updatedCompany),
    });
  };

  public delete = async (
    request: TRequest<{ Params: TCompanyUpdateParams }>,
    reply: TReply,
  ) => {
    const { companyId } = request.params;
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(companyId);
    if (!company)
      throw new Exception({
        code: 404,
        message: 'Company not found',
      });
    CompanyPolicy.delete(request, company);
    const companyDeleteUseCase = new CompanyDeleteUseCase(
      this.companyRepository,
    );
    await companyDeleteUseCase.execute(companyId);
    reply.send({
      success: true,
    });
  };
}
