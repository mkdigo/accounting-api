import { DateTime } from '@mkdigo/datetime';
import {
  TBalanceSheetReportInput,
  TBalanceSheetReportOutput,
} from '@/app/dtos/BalanceSheetDTO';
import {
  IEntryRepository,
  TGroupByOutput,
} from '@/domain/repositories/IEntryRepository';
import { AccountListUseCase } from '../account/AccountListUseCase';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { Money } from '@/domain/value-objects/Money';

export class BalanceSheetReportUseCase {
  constructor(
    private entryRepository: IEntryRepository,
    private accountRepository: IAccountRepository,
  ) {}

  async execute(
    input: TBalanceSheetReportInput,
  ): Promise<TBalanceSheetReportOutput> {
    const start = new DateTime('2020-06-28T00:00:00.000Z');
    start.setYear(input.year);
    start.setMonth(input.month);
    start.setDay(1);
    const end = start.clone();
    end.addMonth(1);
    end.subtractDay(1);

    const gte = new Date(start.getDate());
    const lte = new Date(end.getDate());

    const accountListUseCase = new AccountListUseCase(this.accountRepository);

    // Get Accounts
    const currentAssetsAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('current_assets'),
    });

    const nonCurrentAssetsAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('non_current_assets'),
    });
    const currentLiabilitiesAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('current_liabilities'),
    });
    const nonCurrentLiabilitiesAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('non_current_liabilities'),
    });
    const equityAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      group: new AccountGroup('equity'),
    });
    const revenuesAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('revenues'),
    });
    const costsAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('costs'),
    });
    const expensesAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('expenses'),
    });
    const taxesAcounts = await accountListUseCase.execute({
      companyId: input.companyId,
      subgroup: new AccountSubgroup('taxes'),
    });

    // // Balance Calculate
    const currentAssetsDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('current_assets'),
      lte,
    });
    const currentAssetsCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('current_assets'),
      lte,
    });
    const nonCurrentAssetsDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('non_current_assets'),
      lte,
    });
    const nonCurrentAssetsCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('non_current_assets'),
      lte,
    });
    const currentLiabilitiesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('current_liabilities'),
      lte,
    });
    const currentLiabilitiesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('current_liabilities'),
      lte,
    });
    const nonCurrentLiabilitiesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('non_current_liabilities'),
      lte,
    });
    const nonCurrentLiabilitiesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('non_current_liabilities'),
      lte,
    });
    const equityDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      group: new AccountGroup('equity'),
      lte,
    });
    const equityCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      group: new AccountGroup('equity'),
      lte,
    });
    const balanceRevenuesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('revenues'),
      lte,
    });
    const balanceRevenuesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('revenues'),
      lte,
    });
    const balanceCostsDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('costs'),
      lte,
    });
    const balanceCostsCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('costs'),
      lte,
    });
    const balanceExpensesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('expenses'),
      lte,
    });
    const balanceExpensesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('expenses'),
      lte,
    });
    const balanceTaxesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      subgroup: new AccountSubgroup('taxes'),
      lte,
    });
    const balanceTaxesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      subgroup: new AccountSubgroup('taxes'),
      lte,
    });

    function calculate(
      accountId: string,
      debits: TGroupByOutput,
      credits: TGroupByOutput,
      invert: boolean = false,
    ): Money {
      const debitValue = debits.reduce((prev, current) => {
        if (current.id === accountId) {
          return current.value.sum(prev);
        }
        return prev;
      }, Money.fromNumber(0));
      const creditValue = credits.reduce((prev, current) => {
        if (current.id === accountId) {
          return current.value.sum(prev);
        }
        return prev;
      }, Money.fromNumber(0));
      return debitValue.sub(creditValue).mul(Money.fromNumber(invert ? -1 : 1));
    }

    let result: TBalanceSheetReportOutput = {
      balanceSheet: {
        assets: {
          currentAssets: [],
          nonCurrentAssets: [],
        },
        liabilities: {
          currentLiabilities: [],
          nonCurrentLiabilities: [],
        },
        equity: [],
        amounts: {
          assets: 0,
          currentAssets: 0,
          nonCurrentAssets: 0,
          liabilities: 0,
          currentLiabilities: 0,
          nonCurrentLiabilities: 0,
          equity: 0,
          retainedEarnings: 0,
        },
      },
      incomeStatement: {
        revenues: [],
        costs: [],
        expenses: [],
        taxes: [],
        amounts: {
          revenues: 0,
          costs: 0,
          expenses: 0,
          taxes: 0,
          incomeBeforeTaxes: 0,
          incomeAfterTaxes: 0,
        },
      },
    };

    let currentAssets = Money.fromNumber(0);
    let nonCurrentAssets = Money.fromNumber(0);
    let currentLiabilities = Money.fromNumber(0);
    let nonCurrentLiabilities = Money.fromNumber(0);
    let equity = Money.fromNumber(0);

    for (const account of currentAssetsAcounts) {
      const value = calculate(
        account.id,
        currentAssetsDebits,
        currentAssetsCredits,
      );
      result.balanceSheet.assets.currentAssets.push({
        name: account.name,
        value: value.toNumber(),
      });

      currentAssets = currentAssets.sum(value);
    }

    for (const account of nonCurrentAssetsAcounts) {
      const value = calculate(
        account.id,
        nonCurrentAssetsDebits,
        nonCurrentAssetsCredits,
      );
      result.balanceSheet.assets.nonCurrentAssets.push({
        name: account.name,
        value: value.toNumber(),
      });
      nonCurrentAssets = nonCurrentAssets.sum(value);
    }

    for (const account of currentLiabilitiesAcounts) {
      const value = calculate(
        account.id,
        currentLiabilitiesDebits,
        currentLiabilitiesCredits,
        true,
      );
      result.balanceSheet.liabilities.currentLiabilities.push({
        name: account.name,
        value: value.toNumber(),
      });
      currentLiabilities = currentLiabilities.sum(value);
    }

    for (const account of nonCurrentLiabilitiesAcounts) {
      const value = calculate(
        account.id,
        nonCurrentLiabilitiesDebits,
        nonCurrentLiabilitiesCredits,
        true,
      );
      result.balanceSheet.liabilities.nonCurrentLiabilities.push({
        name: account.name,
        value: value.toNumber(),
      });
      nonCurrentLiabilities = nonCurrentLiabilities.sum(value);
    }

    for (const account of equityAcounts) {
      const value = calculate(account.id, equityDebits, equityCredits, true);
      result.balanceSheet.equity.push({
        name: account.name,
        value: value.toNumber(),
      });
      equity = equity.sum(value);
    }

    let balanceRevenuesAmount = Money.fromNumber(0);
    let balanceCostsAmount = Money.fromNumber(0);
    let balanceExpensesAmount = Money.fromNumber(0);
    let balanceTaxesAmount = Money.fromNumber(0);

    for (const account of revenuesAcounts) {
      const value = calculate(
        account.id,
        balanceRevenuesDebits,
        balanceRevenuesCredits,
        true,
      );
      const prev = Money.fromNumber(balanceRevenuesAmount.toNumber());
      balanceRevenuesAmount = prev.sum(value);
    }

    for (const account of costsAcounts) {
      const value = calculate(
        account.id,
        balanceCostsDebits,
        balanceCostsCredits,
      );
      const prev = Money.fromNumber(balanceCostsAmount.toNumber());
      balanceCostsAmount = prev.sum(value);
    }

    for (const account of expensesAcounts) {
      const value = calculate(
        account.id,
        balanceExpensesDebits,
        balanceExpensesCredits,
      );
      const prev = Money.fromNumber(balanceExpensesAmount.toNumber());
      balanceExpensesAmount = prev.sum(value);
    }

    for (const account of taxesAcounts) {
      const value = calculate(
        account.id,
        balanceTaxesDebits,
        balanceTaxesCredits,
      );
      const prev = Money.fromNumber(balanceTaxesAmount.toNumber());
      balanceTaxesAmount = prev.sum(value);
    }

    const retainedEarnings = balanceRevenuesAmount
      .sub(balanceCostsAmount)
      .sub(balanceExpensesAmount)
      .sub(balanceTaxesAmount);

    result.balanceSheet.amounts.currentAssets = currentAssets.toNumber();
    result.balanceSheet.amounts.nonCurrentAssets = nonCurrentAssets.toNumber();
    result.balanceSheet.amounts.assets = currentAssets
      .sum(nonCurrentAssets)
      .toNumber();

    result.balanceSheet.amounts.currentLiabilities =
      currentLiabilities.toNumber();
    result.balanceSheet.amounts.nonCurrentLiabilities =
      nonCurrentLiabilities.toNumber();
    result.balanceSheet.amounts.equity = equity.toNumber();
    result.balanceSheet.amounts.retainedEarnings = retainedEarnings.toNumber();
    result.balanceSheet.amounts.liabilities = currentLiabilities
      .sum(nonCurrentLiabilities)
      .sum(equity)
      .sum(retainedEarnings)
      .toNumber();

    // Income Statement Calculate

    const revenuesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('revenues'),
    });
    const revenuesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('revenues'),
    });
    const costsDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('costs'),
    });
    const costsCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('costs'),
    });
    const expensesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('expenses'),
    });
    const expensesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('expenses'),
    });
    const taxesDebits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'debit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('taxes'),
    });
    const taxesCredits = await this.entryRepository.groupBy({
      companyId: input.companyId,
      by: 'credit_id',
      gte,
      lte,
      subgroup: new AccountSubgroup('taxes'),
    });

    let revenues = Money.fromNumber(0);
    let costs = Money.fromNumber(0);
    let expenses = Money.fromNumber(0);
    let taxes = Money.fromNumber(0);

    for (const account of revenuesAcounts) {
      const value = calculate(
        account.id,
        revenuesDebits,
        revenuesCredits,
        true,
      );
      result.incomeStatement.revenues.push({
        name: account.name,
        value: value.toNumber(),
      });
      revenues = revenues.sum(value);
    }

    for (const account of costsAcounts) {
      const value = calculate(account.id, costsDebits, costsCredits);
      result.incomeStatement.costs.push({
        name: account.name,
        value: value.toNumber(),
      });
      costs = costs.sum(value);
    }

    for (const account of expensesAcounts) {
      const value = calculate(account.id, expensesDebits, expensesCredits);
      result.incomeStatement.expenses.push({
        name: account.name,
        value: value.toNumber(),
      });
      expenses = expenses.sum(value);
    }

    for (const account of taxesAcounts) {
      const value = calculate(account.id, taxesDebits, taxesCredits);
      result.incomeStatement.taxes.push({
        name: account.name,
        value: value.toNumber(),
      });
      taxes = taxes.sum(value);
    }

    result.incomeStatement.amounts.revenues = revenues.toNumber();
    result.incomeStatement.amounts.costs = costs.toNumber();
    result.incomeStatement.amounts.expenses = expenses.toNumber();
    result.incomeStatement.amounts.taxes = taxes.toNumber();

    const incomeBeforeTaxes = revenues.sub(costs).sub(expenses);
    const incomeAfterTaxes = incomeBeforeTaxes.sub(taxes);
    result.incomeStatement.amounts.incomeBeforeTaxes =
      incomeBeforeTaxes.toNumber();
    result.incomeStatement.amounts.incomeAfterTaxes =
      incomeAfterTaxes.toNumber();

    return result;
  }
}
