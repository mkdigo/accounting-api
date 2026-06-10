import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TServer } from '../HttpServer';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';
import { PublicRoutes } from './PublicRoutes';
import { PrivateRoutes } from './PrivateRoutes';
import { AuthController } from '../controllers/AuthController';
import { UserSchemas } from '../validators/zod/UserSchemas';

export class Router {
  constructor() {}

  public routes = (childServer: TServer) => {
    childServer.register(PublicRoutes.register);
    childServer.register(this.passwordResetRoute);
    childServer.register(this.privateRoutes);
  };

  private privateRoutes = (childServer: TServer) => {
    childServer.decorateRequest('auth', null);
    const authMiddleware = new AuthMiddleware();
    childServer.addHook('preHandler', authMiddleware.defaultLogin);
    childServer.register(PrivateRoutes.register);
  };

  private passwordResetRoute = (childServer: TServer) => {
    childServer.decorateRequest('auth', null);
    const authMiddleware = new AuthMiddleware();
    childServer.addHook('preHandler', authMiddleware.passwordReset);

    const authController = new AuthController();
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post(
        '/users/password-reset',
        UserSchemas.passwordReset,
        authController.passwordReset,
      );
  };
}
