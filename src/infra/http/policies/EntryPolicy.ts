import { Company } from '@/domain/entities/Company';
import { TRequest } from '../HttpServer';
import { Exception } from '@/Exception';

export class EntryPolicy {
  public static list(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }

  public static create(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }

  public static update(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }

  public static delete(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }
}
