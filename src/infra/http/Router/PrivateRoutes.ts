import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserController } from '../controllers/UserController';
import { TServer } from '../HttpServer';
import { UserSchemas } from '../validators/zod/UserSchemas';
import { AuthenticationSchemas } from '../validators/zod/AuthenticationSchemas';
import { AuthController } from '../controllers/AuthController';
import { CompanySchemas } from '../validators/zod/CompanySchemas';
import { CompanyController } from '../controllers/CompanyController';

export class PrivateRoutes {
  public static register = (childServer: TServer) => {
    const authController = new AuthController();
    const userController = new UserController();
    const companyController = new CompanyController();

    childServer
      .withTypeProvider<ZodTypeProvider>()
      .get('/me', AuthenticationSchemas.me, authController.me);
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .get('/logout', AuthenticationSchemas.logout, authController.logout);
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .get(
        '/logout-all-devices',
        AuthenticationSchemas.logoutAllDevices,
        authController.logoutAllDevices,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .put('/users/:userId', UserSchemas.update, userController.update);
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .delete('/users/:userId', UserSchemas.delete, userController.delete);

    childServer
      .withTypeProvider<ZodTypeProvider>()
      .get(
        '/companies',
        CompanySchemas.listByUserId,
        companyController.listByUserId,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .get(
        '/companies/:companyId',
        CompanySchemas.findById,
        companyController.findById,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post('/companies', CompanySchemas.create, companyController.create);
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .put(
        '/companies/:companyId',
        CompanySchemas.update,
        companyController.update,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .delete(
        '/companies/:companyId',
        CompanySchemas.delete,
        companyController.delete,
      );
  };
}
