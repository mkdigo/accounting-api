import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { TServer } from '../HttpServer';

import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { CompanyController } from '../controllers/CompanyController';
import { AccountController } from '../controllers/AccountController';

import { AuthenticationSchemas } from '../validators/zod/AuthenticationSchemas';
import { UserSchemas } from '../validators/zod/UserSchemas';
import { CompanySchemas } from '../validators/zod/CompanySchemas';
import { AccountSchemas } from '../validators/zod/AccountSchemas';

export class PrivateRoutes {
  public static register = (childServer: TServer) => {
    const authController = new AuthController();
    const userController = new UserController();
    const companyController = new CompanyController();
    const accountController = new AccountController();

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
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .get(
        '/companies/:companyId/accounts',
        AccountSchemas.list,
        accountController.list,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .post(
        '/companies/:companyId/accounts',
        AccountSchemas.create,
        accountController.create,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .put(
        '/accounts/:accountId',
        AccountSchemas.update,
        accountController.update,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .delete(
        '/accounts/:accountId',
        AccountSchemas.delete,
        accountController.delete,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .patch(
        '/accounts/:accountId/tags/add',
        AccountSchemas.addTag,
        accountController.addTag,
      );
    childServer
      .withTypeProvider<ZodTypeProvider>()
      .patch(
        '/accounts/:accountId/tags/remove',
        AccountSchemas.removeTag,
        accountController.removeTag,
      );
  };
}
