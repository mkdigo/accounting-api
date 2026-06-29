import z from 'zod';

const dataSchema = z.array(
  z.object({
    name: z.string(),
    value: z.number(),
  }),
);

const balanceSheetSchema = z.object({
  assets: z.object({
    currentAssets: dataSchema,
    nonCurrentAssets: dataSchema,
  }),
  liabilities: z.object({
    currentLiabilities: dataSchema,
    nonCurrentLiabilities: dataSchema,
  }),
  equity: dataSchema,
  amounts: z.object({
    assets: z.number(),
    currentAssets: z.number(),
    nonCurrentAssets: z.number(),
    liabilities: z.number(),
    currentLiabilities: z.number(),
    nonCurrentLiabilities: z.number(),
    equity: z.number(),
    retainedEarnings: z.number(),
  }),
});

const incomeStatementSchema = z.object({
  revenues: dataSchema,
  costs: dataSchema,
  expenses: dataSchema,
  taxes: dataSchema,
  amounts: z.object({
    revenues: z.number(),
    costs: z.number(),
    expenses: z.number(),
    taxes: z.number(),
    incomeBeforeTaxes: z.number(),
    incomeAfterTaxes: z.number(),
  }),
});

export type TBalanceSheetGetParams = z.infer<
  typeof BalanceSheetSchemas.report.schema.params
>;
export type TBalanceSheetGetQuery = z.infer<
  typeof BalanceSheetSchemas.report.schema.querystring
>;

export class BalanceSheetSchemas {
  public static report = {
    schema: {
      summary: 'Balanço Patrimonial e DRE.',
      description: 'Retorna os dados do balanço patrimonial e DRE.',
      params: z.object({
        companyId: z.string(),
      }),
      querystring: z.object({
        year: z.coerce.number().min(2020),
        month: z.coerce.number().gte(1).lte(12),
      }),
      tags: ['Balance Sheet'],
      security: [{ bearerAuth: [] }],
      response: {
        200: z
          .object({
            balanceSheet: balanceSheetSchema,
            incomeStatement: incomeStatementSchema,
          })
          .describe('Successful'),
      },
    },
  };
}
