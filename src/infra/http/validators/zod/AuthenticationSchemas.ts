import z from 'zod';
import { userSchema } from './UserSchemas';

export type TUserLoginBody = z.infer<
  typeof AuthenticationSchemas.userLoginSchema.schema.body
>;

export type TUserPasswordResetCodeBody = z.infer<
  typeof AuthenticationSchemas.userPasswordResetCodeSchema.schema.body
>;

export type TUserPasswordResetTokenBody = z.infer<
  typeof AuthenticationSchemas.userPasswordResetTokenSchema.schema.body
>;

export class AuthenticationSchemas {
  public static userLoginSchema = {
    schema: {
      summary: 'Autenticação do usuário',
      description: 'Recebe um token JWT válido por 1 hora',
      tags: ['Autentication'],
      body: z.object({
        username: z.string(),
        password: z.string(),
      }),
      response: {
        200: z
          .object({
            token: z.string(),
          })
          .describe('Successful authentication'),
      },
    },
  };

  public static userRefreshTokenSchema = {
    schema: {
      summary: 'Refresh Token',
      description:
        'Atualiza o token JWT válido por 1 hora, usando o refresh token que esta armazenado nos cookies.',
      tags: ['Autentication'],
      response: {
        200: z
          .object({
            token: z.string(),
          })
          .describe('Successful authentication'),
      },
    },
  };

  public static userPasswordResetCodeSchema = {
    schema: {
      summary: 'Código de verificação para redefinir a senha.',
      description:
        'Envia para o e-mail do usuário um código de 6 digitos para ser usado na redefinição de senha',
      tags: ['Autentication'],
      body: z.object({
        email: z.email(),
      }),
      response: {
        200: z.undefined().describe('Successful'),
      },
    },
  };

  public static userPasswordResetTokenSchema = {
    schema: {
      summary: 'Token para redefinir a senha.',
      description:
        'Recebe um token válido somente para redefinição de senha. Validade de 10 minutos',
      tags: ['Autentication'],
      body: z.object({
        email: z.email(),
        code: z.string(),
      }),
      response: {
        200: z
          .object({
            token: z.string(),
          })
          .describe('Successful'),
      },
    },
  };

  public static me = {
    schema: {
      summary: 'Dados do usuário',
      description: 'Retorna os dados do usuário autenticado',
      tags: ['Autentication'],
      security: [{ bearerAuth: [] }],
      headers: z
        .object({
          authorization: z.string().regex(/^Bearer .+$/),
        })
        .catchall(z.any()),
      response: {
        200: z
          .object({
            user: userSchema,
          })
          .describe('Successful'),
      },
    },
  };

  public static logout = {
    schema: {
      summary: 'Logout',
      description: 'Inutiliza o token e refresh token',
      tags: ['Autentication'],
      security: [{ bearerAuth: [] }],
      headers: z
        .object({
          authorization: z.string().regex(/^Bearer .+$/),
        })
        .catchall(z.any()),
      response: {
        200: z
          .object({
            user: userSchema,
          })
          .describe('Successful'),
      },
    },
  };

  public static logoutAllDevices = {
    schema: {
      summary: 'Logout em todos dispositivos',
      description: 'Inutiliza o token e refresh token de todos os dispositivos',
      tags: ['Autentication'],
      security: [{ bearerAuth: [] }],
      headers: z
        .object({
          authorization: z.string().regex(/^Bearer .+$/),
        })
        .catchall(z.any()),
      response: {
        200: z
          .object({
            user: userSchema,
          })
          .describe('Successful'),
      },
    },
  };
}
