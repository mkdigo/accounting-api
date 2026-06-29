import { Company } from '@/domain/entities/Company';
import { TRequest } from '../HttpServer';
import { Exception } from '@/Exception';

export class BalanceSheetPolicy {
  public static report(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }
}
