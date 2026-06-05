import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TServer } from '../HttpServer';
import { AuthenticationSchemas } from '../validators/zod/AuthenticationSchemas';
import { UserSchemas } from '../validators/zod/UserSchemas';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';

export class PublicRoutes {
  public static register = (childServer: TServer) => {
    const authController = new AuthController();
    const userController = new UserController();

    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post('/users', UserSchemas.create, userController.create);
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post(
        '/login',
        AuthenticationSchemas.userLoginSchema,
        authController.login,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .get(
        '/tokens/refresh',
        AuthenticationSchemas.userRefreshTokenSchema,
        authController.refreshToken,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post(
        '/codes/email-verify',
        UserSchemas.emailVerifySendCode,
        userController.emailVerifySendCode,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post(
        '/users/email-verify',
        UserSchemas.emailVerify,
        userController.emailVerify,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post(
        '/codes/password-reset',
        AuthenticationSchemas.userPasswordResetCodeSchema,
        authController.createPasswordResetCode,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post(
        '/tokens/password-reset',
        AuthenticationSchemas.userPasswordResetTokenSchema,
        authController.createPasswordResetToken,
      );
  };
}
