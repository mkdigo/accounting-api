import z from 'zod';

export type TCompanyFindByIdParams = z.infer<
  typeof CompanySchemas.findById.schema.params
>;

export type TCompanyCreateBody = z.infer<
  typeof CompanySchemas.create.schema.body
>;

export type TCompanyUpdateParams = z.infer<
  typeof CompanySchemas.update.schema.params
>;

export type TCompanyUpdateBody = z.infer<
  typeof CompanySchemas.update.schema.body
>;

export type TCompanyDeleteParams = z.infer<
  typeof CompanySchemas.delete.schema.params
>;

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});

export class CompanySchemas {
  public static listByUserId = {
    schema: {
      summary: 'Listar empresas.',
      description: 'Lista todas as empresas de um usuário.',
      tags: ['Companies'],
      security: [{ bearerAuth: [] }],
      response: {
        200: z
          .object({
            companies: z.array(companySchema),
          })
          .describe('Successful'),
      },
    },
  };
  public static findById = {
    schema: {
      summary: 'Mostrar os dados de uma empresa.',
      description: 'Somente o dono e quem ele permitir pode ver.',
      tags: ['Companies'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        companyId: z.string(),
      }),
      response: {
        200: z
          .object({
            company: companySchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static create = {
    schema: {
      summary: 'Registrar uma nova empresa.',
      description: 'O usuário pode criar uma nova empresa.',
      tags: ['Companies'],
      security: [{ bearerAuth: [] }],
      body: z.object({
        name: z.string().min(3),
      }),
      response: {
        201: z
          .object({
            company: companySchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static update = {
    schema: {
      summary: 'Atualizar os dados de uma nova empresa.',
      description: 'Somente o dono da empresa pode fazer isso.',
      tags: ['Companies'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        companyId: z.string(),
      }),
      body: z.object({
        name: z.string().min(3),
      }),
      response: {
        200: z
          .object({
            company: companySchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static delete = {
    schema: {
      summary: 'Excluir uma empresa.',
      description: 'Somente o dono da empresa pode fazer isso.',
      tags: ['Companies'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        companyId: z.string(),
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
}
