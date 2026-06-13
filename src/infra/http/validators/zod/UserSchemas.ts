import z from 'zod';

export type TUserPasswordResetBody = z.infer<
  typeof UserSchemas.passwordReset.schema.body
>;
export type TUserCreateBody = z.infer<typeof UserSchemas.create.schema.body>;
export type TUserIdParams = z.infer<typeof UserSchemas.update.schema.params>;
export type TUserUpdateBody = z.infer<typeof UserSchemas.update.schema.body>;
export type TUserEmailVerifySendCodeBody = z.infer<
  typeof UserSchemas.emailVerifySendCode.schema.body
>;
export type TUserEmailVerifyBody = z.infer<
  typeof UserSchemas.emailVerify.schema.body
>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  cellphone: z.string(),
  zipcode: z.string(),
  state: z.string(),
  city: z.string(),
  district: z.string(),
  address: z.string(),
  username: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export class UserSchemas {
  public static passwordReset = {
    schema: {
      summary: 'Redefinir a senha.',
      description:
        'Para redefinir a senha é necessário um token específico para isso.',
      tags: ['Autentication'],
      security: [{ bearerAuth: [] }],
      body: z.object({
        password: z.string(),
      }),
      response: {
        200: z.object({ success: z.literal(true) }).describe('Successful'),
      },
    },
  };

  public static create = {
    schema: {
      summary: 'Registrar um novo usuários.',
      description: 'Qualquer pessoa pode criar uma nova conta',
      tags: ['Users'],
      body: z.object({
        name: z.string().min(3),
        email: z.email(),
        cellphone: z.string().describe('Formato: (11) 91234-1234'),
        zipcode: z.string().describe('Formato: 12345-123'),
        state: z.string(),
        city: z.string(),
        district: z.string(),
        address: z.string(),
        username: z.string().min(6),
        password: z.string().min(8),
      }),
      response: {
        201: z
          .object({
            user: userSchema,
          })
          .describe('Successful'),
      },
    },
  };

  public static update = {
    schema: {
      summary: 'Alterar os dados de um usuário.',
      description: 'Somente o próprio usuário pode fazer isso.',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        userId: z.string(),
      }),
      body: z.object({
        name: z.string().min(3).optional(),
        cellphone: z.string().optional().describe('Formato: (11) 91234-1234'),
        zipcode: z.string().optional().describe('Formato: 12345-123'),
        state: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        address: z.string().optional(),
        username: z.string().min(6).optional(),
      }),
      response: {
        200: z
          .object({
            user: userSchema,
          })
          .describe('Successful'),
      },
    },
  };

  public static delete = {
    schema: {
      summary: 'Excluir um usuário permanentemente.',
      description: 'Somente o próprio usuário pode fazer isso.',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        userId: z.string(),
      }),
      response: {
        200: z.object({ success: z.literal(true) }).describe('Successful'),
      },
    },
  };

  public static emailVerifySendCode = {
    schema: {
      summary: 'Enviar código de segurança para verifição do e-mail.',
      description:
        'Envia para o e-mail do usuário um código de 6 digitos válido por 10 minutos ou 5 tentativas',
      tags: ['Users'],
      body: z.object({
        email: z.email(),
      }),
      response: {
        200: z.object({ success: z.literal(true) }).describe('Successful'),
      },
    },
  };

  public static emailVerify = {
    schema: {
      summary: 'Verifição do e-mail',
      description: 'Envie o código recebido no e-mail para a verificação.',
      tags: ['Users'],
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
}
