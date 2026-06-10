import { TReply, TRequest } from '../HttpServer';

import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { Email } from '@/domain/value-objects/Email';
import { Cellphone } from '@/domain/value-objects/Cellphone';
import { Zipcode } from '@/domain/value-objects/Zipcode';
import { Password } from '@/domain/value-objects/Password';

import { UserCreateUseCase } from '@/app/use-cases/user/UserCreateUseCase';
import { UserUpdateUseCase } from '@/app/use-cases/user/UserUpdateUseCase';
import { UserDeleteUseCase } from '@/app/use-cases/user/UserDeleteUseCase';

import { RepositoryFactory } from '@/infra/factories/RepositoryFactory';
import { ServiceFactory } from '@/infra/factories/ServiceFactory';
import { UserResource } from '../resources/UserResource';
import { UserPolicy } from '../policies/UserPolicy';
import {
  TUserCreateBody,
  TUserUpdateBody,
  TUserIdParams,
  TUserEmailVerifySendCodeBody,
  TUserEmailVerifyBody,
} from '../validators/zod/UserSchemas';
import { ICodeRepository } from '@/domain/repositories/ICodeRepository';
import { UserCreateSecurityCodeUseCase } from '@/app/use-cases/auth/UserCreateSecurityCodeUseCase';
import { VerificationCodeMail } from '@/infra/emails/VerificationCodeMail';
import { UserEmailVerifyUseCase } from '@/app/use-cases/user/UserEmailVerifyUseCase';
import { TokenManagerFactory } from '@/infra/factories/TokenManagerFactory';

export class UserController {
  private userRepository: IUserRepository;
  private codeRepository: ICodeRepository;

  constructor() {
    this.userRepository = RepositoryFactory.getUserRepository();
    this.codeRepository = RepositoryFactory.getCodeRepository();
  }

  public create = async (
    request: TRequest<{ Body: TUserCreateBody }>,
    reply: TReply,
  ) => {
    UserPolicy.create(request);
    const input = {
      ...request.body,
      email: new Email(request.body.email),
      cellphone: new Cellphone(request.body.cellphone),
      zipcode: new Zipcode(request.body.zipcode),
      password: new Password(request.body.password),
    };
    const passwordHasher = ServiceFactory.getPasswordHasher();
    const userCreateUseCase = new UserCreateUseCase(
      this.userRepository,
      passwordHasher,
    );
    const user = await userCreateUseCase.execute(input);
    const randomCode = ServiceFactory.getRancomCode();
    const userCreateSecurityCodeUseCase = new UserCreateSecurityCodeUseCase(
      this.userRepository,
      this.codeRepository,
      randomCode,
    );
    const { code } = await userCreateSecurityCodeUseCase.execute({
      email: user.email,
      type: 'email_verification',
    });
    const mailService = new VerificationCodeMail();
    await mailService.send({
      email: user.email,
      code: code.code,
      subject: 'Verifique seu e-mail',
    });
    const userResource = new UserResource();
    reply.code(201).send({ user: userResource.single(user) });
  };

  public update = async (
    request: TRequest<{ Params: TUserIdParams; Body: TUserUpdateBody }>,
    reply: TReply,
  ) => {
    const userId: string = request.params.userId;
    UserPolicy.update(request, userId);
    const input = {
      name: request.body.name,
      cellphone: request.body.cellphone
        ? new Cellphone(request.body.cellphone)
        : undefined,
      zipcode: request.body.zipcode
        ? new Zipcode(request.body.zipcode)
        : undefined,
      state: request.body.state,
      city: request.body.city,
      district: request.body.district,
      address: request.body.address,
      username: request.body.username,
    };

    const userCreateUseCase = new UserUpdateUseCase(this.userRepository);
    const user = await userCreateUseCase.execute(userId, input);
    const userResource = new UserResource();
    reply.send({ user: userResource.single(user) });
  };

  public delete = async (
    request: TRequest<{ Params: TUserIdParams }>,
    reply: TReply,
  ) => {
    const userId: string = request.params.userId;
    UserPolicy.delete(request, userId);
    const userDeleteUseCase = new UserDeleteUseCase(this.userRepository);
    await userDeleteUseCase.execute(userId);
    reply.send({ success: true });
  };

  public emailVerifySendCode = async (
    request: TRequest<{ Body: TUserEmailVerifySendCodeBody }>,
    reply: TReply,
  ) => {
    const email = new Email(request.body.email);

    const randomCode = ServiceFactory.getRancomCode();
    const userCreateSecurityCodeUseCase = new UserCreateSecurityCodeUseCase(
      this.userRepository,
      this.codeRepository,
      randomCode,
    );
    const { code, user } = await userCreateSecurityCodeUseCase.execute({
      email,
      type: 'email_verification',
    });
    const mailService = new VerificationCodeMail();
    await mailService.send({
      email: user.email,
      code: code.code,
      subject: 'Verifique seu e-mail',
    });
    reply.send({ success: true });
  };

  public emailVerify = async (
    request: TRequest<{ Body: TUserEmailVerifyBody }>,
    reply: TReply,
  ) => {
    const input = {
      email: new Email(request.body.email),
      code: request.body.code,
    };
    const tokenRepository = RepositoryFactory.getTokenRepository();
    const tokenManager = TokenManagerFactory.get();
    const userEmailVerifyUseCase = new UserEmailVerifyUseCase(
      this.userRepository,
      this.codeRepository,
      tokenRepository,
      tokenManager,
    );
    const { token, refreshToken } = await userEmailVerifyUseCase.execute(input);
    reply.setCookie('refreshToken', JSON.stringify(refreshToken), {
      path: '/', // Disponível para todo o site
      secure: true, // true Só envia via HTTPS, em ambiente de desenvolvimento pode deixar false caso o navegador não aceite
      httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
      sameSite: 'strict', // Proteção contra CSRF
      maxAge: 60 * 60 * 24 * 7, // Tempo de vida (ex: 7 dias)
    });
    reply.send({ token: token.content });
  };
}
