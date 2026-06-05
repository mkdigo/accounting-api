import { Exception } from '@/Exception';
import { TRequest } from '../HttpServer';

export class UserPolicy {
  public static create(request: TRequest): boolean {
    return true;
  }

  public static update(request: TRequest, userId: string): boolean {
    const authUser = request.auth?.user;
    if (authUser?.id === userId) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }

  public static changePassword(request: TRequest, userId: string): boolean {
    const authUser = request.auth?.user;
    if (authUser?.id === userId) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }

  public static delete(request: TRequest, userId: string): boolean {
    const authUser = request.auth?.user;
    if (authUser?.id === userId) return true;
    throw new Exception({ code: 403, message: 'Forbidden' });
  }
}
