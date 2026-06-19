import { Exception } from '@/Exception';

const availableSubgroups = [
  'current_assets',
  'non_current_assets',
  'current_liabilities',
  'non_current_liabilities',
  'revenues',
  'costs',
  'expenses',
  null,
] as const;

type TAccountSubgroup = (typeof availableSubgroups)[number];

export class AccountSubgroup {
  readonly value: TAccountSubgroup;

  constructor(value: string | null) {
    if (!availableSubgroups.includes(value as any))
      throw new Exception({
        code: 400,
        message: 'Invalid account subgroup',
        errors: { subgroup: ['Invalid subgroup'] },
      });
    this.value = value as any;
  }
}
