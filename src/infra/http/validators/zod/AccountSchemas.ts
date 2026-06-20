import z from 'zod';

export type TAccountListParams = z.infer<
  typeof AccountSchemas.list.schema.params
>;
export type TAccountListQuery = z.infer<
  typeof AccountSchemas.list.schema.querystring
>;
export type TAccountCreateParams = z.infer<
  typeof AccountSchemas.create.schema.params
>;
export type TAccountCreateBody = z.infer<
  typeof AccountSchemas.create.schema.body
>;
export type TAccountUpdateParams = z.infer<
  typeof AccountSchemas.update.schema.params
>;
export type TAccountUpdateBody = z.infer<
  typeof AccountSchemas.update.schema.body
>;
export type TAccountDeleteParams = z.infer<
  typeof AccountSchemas.delete.schema.params
>;
export type TAccountAddTagParams = z.infer<
  typeof AccountSchemas.addTag.schema.params
>;
export type TAccountAddTagBody = z.infer<
  typeof AccountSchemas.addTag.schema.body
>;
export type TAccountRemoveTagParams = z.infer<
  typeof AccountSchemas.removeTag.schema.params
>;
export type TAccountRemoveTagBody = z.infer<
  typeof AccountSchemas.removeTag.schema.body
>;

const accountSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  name: z.string(),
  group: z.string(),
  subgroup: z.string().nullable(),
  tags: z.array(z.string()),
});

export class AccountSchemas {
  public static list = {
    schema: {
      summary: 'Listar Contas.',
      description: 'Lista todas as contas de uma empresa.',
      tags: ['Accounts'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        companyId: z.string(),
      }),
      querystring: z.object({
        name: z.string().optional(),
        group: z.string().optional(),
        subgroup: z.string().optional(),
        tag: z.string().optional(),
      }),
      response: {
        200: z
          .object({
            accounts: z.array(accountSchema),
          })
          .describe('Successful'),
      },
    },
  };
  public static create = {
    schema: {
      summary: 'Registrar uma conta.',
      description: 'Registra uma nova conta para uma empresa.',
      tags: ['Accounts'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        companyId: z.string(),
      }),
      body: z.object({
        name: z.string().min(3),
        group: z.string(),
        subgroup: z.string().nullable(),
        tags: z.array(z.string()),
      }),
      response: {
        201: z
          .object({
            account: accountSchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static update = {
    schema: {
      summary: 'Editar uma conta.',
      description: 'Editar os dados de uma conta.',
      tags: ['Accounts'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        accountId: z.string(),
      }),
      body: z.object({
        name: z.string().min(3),
        group: z.string(),
        subgroup: z.string().nullable(),
      }),
      response: {
        200: z
          .object({
            account: accountSchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static delete = {
    schema: {
      summary: 'Excluir uma conta.',
      description: 'Excluir uma conta o todos os dados relacionados a ela.',
      tags: ['Accounts'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        accountId: z.string(),
      }),
      response: {
        200: z
          .object({
            success: z.boolean(),
          })
          .describe('Successful'),
      },
    },
  };
  public static addTag = {
    schema: {
      summary: 'Adicionar uma tag a uma conta.',
      description: 'Adicionar uma tag a uma conta',
      tags: ['Accounts'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        accountId: z.string(),
      }),
      body: z.object({
        tagName: z.string().min(3),
      }),
      response: {
        200: z
          .object({
            account: accountSchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static removeTag = {
    schema: {
      summary: 'Remove uma tag de uma conta.',
      description: 'Remove uma tag de uma conta',
      tags: ['Accounts'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        accountId: z.string(),
      }),
      body: z.object({
        tagName: z.string().min(3),
      }),
      response: {
        200: z
          .object({
            account: accountSchema,
          })
          .describe('Successful'),
      },
    },
  };
}
