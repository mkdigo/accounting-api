import { TReply, TRequest } from '../HttpServer';

import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ICodeRepository } from '@/domain/repositories/ICodeRepository';
import { ITokenRepository } from '@/domain/repositories/ITokenRepository';
import { Email } from '@/domain/value-objects/Email';
import { Password } from '@/domain/value-objects/Password';

import { UserAuthenticationUseCase } from '@/app/use-cases/auth/UserAuthenticationUseCase';
import { UserCreateSecurityCodeUseCase } from '@/app/use-cases/auth/UserCreateSecurityCodeUseCase';
import { UserCreatePasswordResetTokenUseCase } from '@/app/use-cases/auth/UserCreatePasswordResetTokenUseCase';
import { UserChangePasswordUseCase } from '@/app/use-cases/user/UserChangePasswordUseCase';
import { UserRefreshTokenUseCase } from '@/app/use-cases/auth/UserRefreshTokenUseCase';

import { BcryptHasher } from '@/infra/services/BcryptHasher';
import { JWTTokenManager } from '@/infra/auth/JWTTokenManager';
import { RepositoryFactory } from '@/infra/factories/RepositoryFactory';
import { ServiceFactory } from '@/infra/factories/ServiceFactory';
import { VerificationCodeMail } from '@/infra/emails/VerificationCodeMail';
import {
  TUserLoginBody,
  TUserPasswordResetCodeBody,
  TUserPasswordResetTokenBody,
} from '../validators/zod/AuthenticationSchemas';
import { TUserPasswordResetBody } from '../validators/zod/UserSchemas';
import { UserResource } from '../resources/UserResource';

import { env } from '@/env';
import { Exception } from '@/Exception';

export class AuthController {
  private userRepository: IUserRepository;
  private codeRepository: ICodeRepository;
  private tokenRepository: ITokenRepository;

  constructor() {
    this.userRepository = RepositoryFactory.getUserRepository();
    this.codeRepository = RepositoryFactory.getCodeRepository();
    this.tokenRepository = RepositoryFactory.getTokenRepository();
  }

  public me = async (request: TRequest, reply: TReply) => {
    const authUser = request.auth?.user;
    if (!authUser)
      throw new Exception({ message: 'User not found.', code: 404 });
    const user = await this.userRepository.findById(authUser.id);
    if (!user) throw new Exception({ message: 'User not found.', code: 404 });
    const userResource = new UserResource();
    reply.send({
      user: userResource.single(user),
    });
  };

  public login = async (
    request: TRequest<{ Body: TUserLoginBody }>,
    reply: TReply,
  ) => {
    const input = request.body;
    const passwordHasher = new BcryptHasher();
    const tokenManager = new JWTTokenManager();
    const userAuthenticationUseCase = new UserAuthenticationUseCase(
      this.userRepository,
      this.tokenRepository,
      passwordHasher,
      tokenManager,
    );
    const { token, refreshToken } =
      await userAuthenticationUseCase.execute(input);
    reply.setCookie('refreshToken', JSON.stringify(refreshToken), {
      path: '/', // Disponível para todo o site
      secure: env.NODE_ENV === 'production' ? true : false, // Só envia via HTTPS (mantenha false apenas em ambiente de desenvolvimento local sem HTTPS)
      httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
      sameSite: 'strict', // Proteção contra CSRF
      maxAge: 60 * 60 * 24 * 7, // Tempo de vida (ex: 7 dias)
    });
    reply.send({ token: token.content });
  };

  public refreshToken = async (request: TRequest, reply: TReply) => {
    const cookiesRefreshToken = request.cookies?.refreshToken;
    if (!cookiesRefreshToken)
      throw new Exception({
        code: 401,
        message: 'Refresh token is required.',
      });
    const refreshToken: { id: string; content: string } =
      JSON.parse(cookiesRefreshToken);
    const token = await this.tokenRepository.findById(refreshToken.id);
    if (token && token.is_banned)
      throw new Exception({
        code: 401,
        message: 'Invalid refresh token',
      });
    const tokenManager = new JWTTokenManager();
    const userRefreshTokenUseCase = new UserRefreshTokenUseCase(
      this.userRepository,
      this.tokenRepository,
      tokenManager,
    );
    const { token: newToken, refreshToken: newRefreshToken } =
      await userRefreshTokenUseCase.execute(refreshToken.content);
    reply.setCookie('refreshToken', JSON.stringify(newRefreshToken), {
      path: '/', // Disponível para todo o site
      secure: env.NODE_ENV === 'production' ? true : false, // Só envia via HTTPS (mantenha false apenas em ambiente de desenvolvimento local sem HTTPS)
      httpOnly: true, // Impede acesso via JavaScript (Proteção XSS)
      sameSite: 'strict', // Proteção contra CSRF
      maxAge: 60 * 60 * 24 * 7, // Tempo de vida (ex: 7 dias)
    });
    reply.send({ token: newToken.content });
  };

  public logout = async (request: TRequest, reply: TReply) => {
    const cookiesRefreshToken = request.cookies?.refreshToken;
    if (cookiesRefreshToken) {
      const refreshToken: { id: string; content: string } =
        JSON.parse(cookiesRefreshToken);
      await this.tokenRepository.ban(refreshToken.id);
    }
    await this.tokenRepository.ban(request.auth!.tokenId);
    reply.send();
  };

  public logoutAllDevices = async (request: TRequest, reply: TReply) => {
    await this.tokenRepository.banAll(request.auth!.user.id);
    reply.send();
  };

  public createPasswordResetCode = async (
    request: TRequest<{ Body: TUserPasswordResetCodeBody }>,
    reply: TReply,
  ) => {
    const email = new Email(request.body.email);

    const randomCode = ServiceFactory.getRancomCode();
    const userCreatePasswordResetCodeUseCase =
      new UserCreateSecurityCodeUseCase(
        this.userRepository,
        this.codeRepository,
        randomCode,
      );
    const { code, user } = await userCreatePasswordResetCodeUseCase.execute({
      email,
      type: 'password_reset',
    });
    const mailService = new VerificationCodeMail();
    await mailService.send({
      email: user.email,
      code: code.code,
      subject: 'Alteração de senha',
    });

    reply.send();
  };

  public createPasswordResetToken = async (
    request: TRequest<{ Body: TUserPasswordResetTokenBody }>,
    reply: TReply,
  ) => {
    const input = {
      email: new Email(request.body.email),
      code: request.body.code,
    };
    const tokenManager = new JWTTokenManager();
    const userCreatePasswordResetTokenUseCase =
      new UserCreatePasswordResetTokenUseCase(
        this.userRepository,
        this.codeRepository,
        this.tokenRepository,
        tokenManager,
      );
    const { token } = await userCreatePasswordResetTokenUseCase.execute(input);
    reply.send({ token });
  };

  public passwordReset = async (
    request: TRequest<{ Body: TUserPasswordResetBody }>,
    reply: TReply,
  ) => {
    const password = new Password(request.body.password);
    const passwordHasher = ServiceFactory.getPasswordHasher();
    const userChangePasswordUseCase = new UserChangePasswordUseCase(
      this.userRepository,
      this.tokenRepository,
      passwordHasher,
    );
    await userChangePasswordUseCase.execute(request.auth!.user!.id, password);
    reply.send();
  };
}
