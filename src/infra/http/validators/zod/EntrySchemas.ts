import z from 'zod';

export type TEntryListParams = z.infer<typeof EntrySchemas.list.schema.params>;
export type TEntryListQuery = z.infer<
  typeof EntrySchemas.list.schema.querystring
>;
export type TEntryCreateParams = z.infer<
  typeof EntrySchemas.create.schema.params
>;
export type TEntryCreateBody = z.infer<typeof EntrySchemas.create.schema.body>;
export type TEntryUpdateParams = z.infer<
  typeof EntrySchemas.update.schema.params
>;
export type TEntryUpdateBody = z.infer<typeof EntrySchemas.update.schema.body>;
export type TEntryDeleteParams = z.infer<
  typeof EntrySchemas.delete.schema.params
>;

const entrySchema = z.object({
  id: z.string(),
  company_id: z.string(),
  inclusion: z.string(),
  debit_id: z.string(),
  debit_name: z.string(),
  credit_id: z.string(),
  credit_name: z.string(),
  value: z.number(),
  note: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export class EntrySchemas {
  public static list = {
    schema: {
      summary: 'Listar lançamentos.',
      description:
        'Lista todos os lançamentos de uma empresa em um determinado periodo.',
      params: z.object({
        companyId: z.string(),
      }),
      querystring: z.object({
        start: z.iso.datetime(),
        end: z.iso.datetime(),
        search: z.string(),
        lastId: z.string().optional(),
        subgroup: z.string().optional(),
      }),
      tags: ['Entries'],
      security: [{ bearerAuth: [] }],
      response: {
        200: z
          .object({
            entries: z.array(entrySchema),
          })
          .describe('Successful'),
      },
    },
  };
  public static create = {
    schema: {
      summary: 'Criar um lançamentos.',
      description: 'Cria um lançamento para uma empresa.',
      params: z.object({
        companyId: z.string(),
      }),
      body: z.object({
        inclusion: z.iso.date(),
        debitId: z.string(),
        creditId: z.string(),
        value: z.number(),
        note: z.string(),
      }),
      tags: ['Entries'],
      security: [{ bearerAuth: [] }],
      response: {
        201: z
          .object({
            entry: entrySchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static update = {
    schema: {
      summary: 'Editar um lançamentos.',
      description: 'Edita um lançamento.',
      params: z.object({
        entryId: z.string(),
      }),
      body: z.object({
        inclusion: z.iso.date(),
        debitId: z.string(),
        creditId: z.string(),
        value: z.number(),
        note: z.string(),
      }),
      tags: ['Entries'],
      security: [{ bearerAuth: [] }],
      response: {
        200: z
          .object({
            entry: entrySchema,
          })
          .describe('Successful'),
      },
    },
  };
  public static delete = {
    schema: {
      summary: 'Excluir um lançamentos.',
      description: 'Exclui um lançamento.',
      params: z.object({
        entryId: z.string(),
      }),
      tags: ['Entries'],
      security: [{ bearerAuth: [] }],
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
