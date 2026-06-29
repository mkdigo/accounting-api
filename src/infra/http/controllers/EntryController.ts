import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { IEntryRepository } from '@/domain/repositories/IEntryRepository';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';

import { EntryListUseCase } from '@/app/use-cases/entry/EntryListUseCase';
import { CompanyFindByIdUseCase } from '@/app/use-cases/company/CompanyFindByIdUseCase';
import { EntryCreateUseCase } from '@/app/use-cases/entry/EntryCreateUseCase';
import { EntryFindByIdUseCase } from '@/app/use-cases/entry/EntryFindByIdUseCase';
import { EntryUpdateUseCase } from '@/app/use-cases/entry/EntryUpdateUseCase';
import { EntryDeleteUseCase } from '@/app/use-cases/entry/EntryDeleteUseCase';

import { TReply, TRequest } from '../HttpServer';
import { RepositoryFactory } from '@/infra/factories/RepositoryFactory';
import {
  TEntryCreateBody,
  TEntryCreateParams,
  TEntryDeleteParams,
  TEntryListParams,
  TEntryListQuery,
  TEntryUpdateBody,
  TEntryUpdateParams,
} from '../validators/zod/EntrySchemas';
import { EntryPolicy } from '../policies/EntryPolicy';

import { Exception } from '@/Exception';
import { EntryResource } from '../resources/EntryResource';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

export class EntryController {
  private entryRepository: IEntryRepository;
  private accountRepository: IAccountRepository;
  private companyRepository: ICompanyRepository;

  constructor() {
    this.entryRepository = RepositoryFactory.getEntryRepository();
    this.accountRepository = RepositoryFactory.getAccountRepository();
    this.companyRepository = RepositoryFactory.getCompanyRepository();
  }

  public list = async (
    request: TRequest<{ Query: TEntryListQuery; Params: TEntryListParams }>,
    reply: TReply,
  ) => {
    const { companyId } = request.params;
    const input = request.query;
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(companyId);
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    EntryPolicy.list(request, company);
    const entryListUseCase = new EntryListUseCase(this.entryRepository);
    const entries = await entryListUseCase.execute({
      companyId,
      ...input,
      take: 50,
      subgroup: input.subgroup
        ? new AccountSubgroup(input.subgroup)
        : undefined,
    });
    const entryResource = new EntryResource();
    reply.send({
      entries: entryResource.collection(entries),
    });
  };

  public create = async (
    request: TRequest<{ Body: TEntryCreateBody; Params: TEntryCreateParams }>,
    reply: TReply,
  ) => {
    const { companyId } = request.params;
    const input = request.body;
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(companyId);
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    EntryPolicy.create(request, company);
    const entryCreateUseCase = new EntryCreateUseCase(
      this.entryRepository,
      this.accountRepository,
    );
    const entry = await entryCreateUseCase.execute({
      companyId,
      debitId: input.debitId,
      creditId: input.creditId,
      inclusion: input.inclusion,
      note: input.note,
      value: input.value,
    });
    const entryResource = new EntryResource();
    reply.code(201).send({
      entry: entryResource.single(entry),
    });
  };

  public update = async (
    request: TRequest<{ Body: TEntryUpdateBody; Params: TEntryUpdateParams }>,
    reply: TReply,
  ) => {
    const { entryId } = request.params;
    const input = request.body;
    const entryFindByIdUseCase = new EntryFindByIdUseCase(this.entryRepository);
    const foundEntry = await entryFindByIdUseCase.execute(entryId);
    if (!foundEntry)
      throw new Exception({
        code: 404,
        message: 'Entry not found',
      });
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(foundEntry.company_id);
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    EntryPolicy.update(request, company);
    const entryUpdateUseCase = new EntryUpdateUseCase(
      this.entryRepository,
      this.accountRepository,
    );
    const entry = await entryUpdateUseCase.execute(foundEntry.id, {
      debitId: input.debitId,
      creditId: input.creditId,
      inclusion: input.inclusion,
      note: input.note,
      value: input.value,
    });
    const entryResource = new EntryResource();
    reply.send({
      entry: entryResource.single(entry),
    });
  };

  public delete = async (
    request: TRequest<{ Params: TEntryDeleteParams }>,
    reply: TReply,
  ) => {
    const { entryId } = request.params;
    const entryFindByIdUseCase = new EntryFindByIdUseCase(this.entryRepository);
    const foundEntry = await entryFindByIdUseCase.execute(entryId);
    if (!foundEntry)
      throw new Exception({
        code: 404,
        message: 'Entry not found',
      });
    const companyFindByIdUseCase = new CompanyFindByIdUseCase(
      this.companyRepository,
    );
    const company = await companyFindByIdUseCase.execute(foundEntry.company_id);
    if (!company)
      throw new Exception({ code: 404, message: 'Company not found' });
    EntryPolicy.delete(request, company);
    const entrydeleteUseCase = new EntryDeleteUseCase(this.entryRepository);
    await entrydeleteUseCase.execute(entryId);
    reply.send({
      success: true,
    });
  };
}
