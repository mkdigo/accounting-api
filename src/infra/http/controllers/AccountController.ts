import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';

import { AccountListUseCase } from '@/app/use-cases/account/AccountListUseCase';
import { CompanyFindByIdUseCase } from '@/app/use-cases/company/CompanyFindByIdUseCase';
import { AccountCreateUseCase } from '@/app/use-cases/account/AccountCreateUseCase';
import { AccountFindByIdUseCase } from '@/app/use-cases/account/AccountFindByIdUseCase';
import { AccountUpdateUseCase } from '@/app/use-cases/account/AccountUpdateUseCase';
import { AccountDeleteUseCase } from '@/app/use-cases/account/AccountDeleteUseCase';
import { AccountAddTagUseCase } from '@/app/use-cases/account/AccountAddTagUseCase';
import { AccountRemoveTagUseCase } from '@/app/use-cases/account/AccountRemoveTagUseCase';

import { TReply, TRequest } from '../HttpServer';
import { CompanyRepositoryPrisma } from '@/infra/database/repositories/prisma/CompanyRepositoryPrisma';
import { RepositoryFactory } from '@/infra/factories/RepositoryFactory';
import { AccountPolicy } from '../policies/AccountPolicy';
import { AccountResource } from '../resources/AccountResource';
import {
  TAccountAddTagBody,
  TAccountAddTagParams,
  TAccountCreateBody,
  TAccountCreateParams,
  TAccountDeleteParams,
  TAccountListParams,
  TAccountListQuery,
  TAccountRemoveTagBody,
  TAccountRemoveTagParams,
  TAccountUpdateBody,
  TAccountUpdateParams,
} from '../validators/zod/AccountSchemas';

import { Exception } from '@/Exception';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { TagName } from '@/domain/value-objects/TagName';

export class AccountController {
  private accountRepository: IAccountRepository;
  private companyRepository: ICompanyRepository;

  constructor() {
    this.accountRepository = RepositoryFactory.getAccountRepository();
    this.companyRepository = new CompanyRepositoryPrisma();
  }

  public list = async (
    request: TRequest<{ Params: TAccountListParams; Query: TAccountListQuery }>,
    reply: TReply,
  ) => {
    const { companyId } = request.params;
    const name = request.query.name;
    const group = request.query.group
      ? new AccountGroup(request.query.group)
      : undefined;
    const subgroup = request.query.subgroup
      ? new AccountSubgroup(request.query.subgroup)
      : undefined;
    const tagName = request.query.tag
      ? new TagName(request.query.tag)
      : undefined;
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(companyId);
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    AccountPolicy.list(request, company);
    const accountListUseCase = new AccountListUseCase(this.accountRepository);
    const accounts = await accountListUseCase.execute({
      companyId: company.id,
      name,
      group,
      subgroup,
      tagName,
    });
    const accountResource = new AccountResource();
    reply.send({
      accounts: accountResource.collection(accounts),
    });
  };

  public create = async (
    request: TRequest<{
      Params: TAccountCreateParams;
      Body: TAccountCreateBody;
    }>,
    reply: TReply,
  ) => {
    const { companyId } = request.params;
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(companyId);
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    AccountPolicy.create(request, company);
    const input = request.body;
    const accountCreateUseCase = new AccountCreateUseCase(
      this.accountRepository,
    );
    const account = await accountCreateUseCase.execute({
      ...input,
      group: new AccountGroup(input.group),
      subgroup: new AccountSubgroup(input.subgroup),
      company_id: companyId,
    });
    const accountResource = new AccountResource();
    reply.code(201).send({
      account: accountResource.single(account),
    });
  };

  public update = async (
    request: TRequest<{
      Params: TAccountUpdateParams;
      Body: TAccountUpdateBody;
    }>,
    reply: TReply,
  ) => {
    const { accountId } = request.params;
    const accountFindByIdUseCase = new AccountFindByIdUseCase(
      this.accountRepository,
    );
    const foundAccount = await accountFindByIdUseCase.execute(accountId);
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(
      foundAccount.company_id,
    );
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    AccountPolicy.update(request, company);
    const input = request.body;
    const accountUpdateUseCase = new AccountUpdateUseCase(
      this.accountRepository,
    );
    const account = await accountUpdateUseCase.execute(accountId, {
      name: input.name,
      group: new AccountGroup(input.group),
      subgroup: new AccountSubgroup(input.subgroup),
    });
    const accountResource = new AccountResource();
    reply.send({
      account: accountResource.single(account),
    });
  };

  public delete = async (
    request: TRequest<{
      Params: TAccountDeleteParams;
    }>,
    reply: TReply,
  ) => {
    const { accountId } = request.params;
    const accountFindByIdUseCase = new AccountFindByIdUseCase(
      this.accountRepository,
    );
    const foundAccount = await accountFindByIdUseCase.execute(accountId);
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(
      foundAccount.company_id,
    );
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    AccountPolicy.delete(request, company);
    const accountDeleteUseCase = new AccountDeleteUseCase(
      this.accountRepository,
    );
    await accountDeleteUseCase.execute(accountId);
    reply.send({
      success: true,
    });
  };

  public addTag = async (
    request: TRequest<{
      Params: TAccountAddTagParams;
      Body: TAccountAddTagBody;
    }>,
    reply: TReply,
  ) => {
    const { accountId } = request.params;
    const accountFindByIdUseCase = new AccountFindByIdUseCase(
      this.accountRepository,
    );
    const foundAccount = await accountFindByIdUseCase.execute(accountId);
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(
      foundAccount.company_id,
    );
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    AccountPolicy.addTag(request, company);
    const input = request.body;
    const accountAddTagUseCase = new AccountAddTagUseCase(
      this.accountRepository,
    );
    const account = await accountAddTagUseCase.execute(
      foundAccount,
      new TagName(input.tagName),
    );
    const accountResource = new AccountResource();
    reply.send({
      account: accountResource.single(account),
    });
  };

  public removeTag = async (
    request: TRequest<{
      Params: TAccountRemoveTagParams;
      Body: TAccountRemoveTagBody;
    }>,
    reply: TReply,
  ) => {
    const { accountId } = request.params;
    const accountFindByIdUseCase = new AccountFindByIdUseCase(
      this.accountRepository,
    );
    const foundAccount = await accountFindByIdUseCase.execute(accountId);
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(
      foundAccount.company_id,
    );
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    AccountPolicy.removeTag(request, company);
    const input = request.body;
    const accountRemoveTagUseCase = new AccountRemoveTagUseCase(
      this.accountRepository,
    );
    const account = await accountRemoveTagUseCase.execute(
      foundAccount,
      new TagName(input.tagName),
    );
    const accountResource = new AccountResource();
    reply.send({
      account: accountResource.single(account),
    });
  };
}
