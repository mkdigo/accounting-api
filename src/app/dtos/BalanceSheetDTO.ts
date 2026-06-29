type TBalanceSheet = {
  assets: {
    currentAssets: any;
    nonCurrentAssets: any;
  };
  liabilities: {
    currentLiabilities: any;
    nonCurrentLiabilities: any;
  };
  equity: any;
  amounts: {
    assets: number;
    currentAssets: number;
    nonCurrentAssets: number;
    liabilities: number;
    currentLiabilities: number;
    nonCurrentLiabilities: number;
    equity: number;
    retainedEarnings: number;
  };
};

type TIncomeStatement = {
  revenues: any;
  costs: any;
  expenses: any;
  taxes: any;
  amounts: {
    revenues: number;
    costs: number;
    expenses: number;
    taxes: number;
    incomeBeforeTaxes: number;
    incomeAfterTaxes: number;
  };
};

export type TBalanceSheetReportInput = {
  companyId: string;
  year: number;
  month: number;
};

export type TBalanceSheetReportOutput = {
  balanceSheet: TBalanceSheet;
  incomeStatement: TIncomeStatement;
};
