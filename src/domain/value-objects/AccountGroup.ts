import { Exception } from '@/Exception';

const availableGroups = [
  'assets',
  'liabilities',
  'equity',
  'income_statement_accounts',
] as const;

type TAccountGroup = (typeof availableGroups)[number];

export class AccountGroup {
  readonly value: TAccountGroup;

  constructor(value: string) {
    if (!availableGroups.includes(value as any))
      throw new Exception({
        code: 400,
        message: 'Invalid account group',
        errors: { group: ['Invalid group'] },
      });
    this.value = value as any;
  }
}
