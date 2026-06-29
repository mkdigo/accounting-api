import { BalanceSheetReportUseCase } from '@/app/use-cases/balance-sheet/BalanceSheetReportUseCase';
import { TReply, TRequest } from '../HttpServer';
import {
  TBalanceSheetGetParams,
  TBalanceSheetGetQuery,
} from '../validators/zod/BalanceSheetSchemas';
import { RepositoryFactory } from '@/infra/factories/RepositoryFactory';
import { CompanyFindByIdUseCase } from '@/app/use-cases/company/CompanyFindByIdUseCase';
import { ICompanyRepository } from '@/domain/repositories/ICompanyRepository';
import { Exception } from '@/Exception';
import { BalanceSheetPolicy } from '../policies/BalanceSheetPolicy';

export class BalanceSheetController {
  private companyRepository: ICompanyRepository;

  constructor() {
    this.companyRepository = RepositoryFactory.getCompanyRepository();
  }

  public report = async (
    request: TRequest<{
      Query: TBalanceSheetGetQuery;
      Params: TBalanceSheetGetParams;
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
    BalanceSheetPolicy.report(request, company);
    const entryRepository = RepositoryFactory.getEntryRepository();
    const accountRepository = RepositoryFactory.getAccountRepository();
    const input = request.query;
    const balanceSheetReportUseCase = new BalanceSheetReportUseCase(
      entryRepository,
      accountRepository,
    );
    const data = await balanceSheetReportUseCase.execute({
      companyId,
      year: input.year,
      month: input.month,
    });
    reply.send(data);
  };
}
