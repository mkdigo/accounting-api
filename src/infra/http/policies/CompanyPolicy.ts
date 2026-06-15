import { Company } from '@/domain/entities/Company';
import { TRequest } from '../HttpServer';

export class CompanyPolicy {
  public static listByUserId(request: TRequest): boolean {
    return true;
  }

  public static findById(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    return false;
  }

  public static create(request: TRequest): boolean {
    return true;
  }

  public static update(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    return false;
  }
  public static delete(request: TRequest, company: Company): boolean {
    if (request.auth?.user.id === company.user_id) return true;
    return false;
  }
}
