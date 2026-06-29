import { TagName } from '../value-objects/TagName';
import { Account } from './Account';

const accountSubgroupTags = {
  current_assets: {
    tags: ['bank', 'accounts_receivable'],
  },
  non_current_assets: {
    tags: ['accounts_receivable'],
  },
  current_liabilities: {
    tags: ['credit_card', 'accounts_payable'],
  },
  non_current_liabilities: {
    tags: ['accounts_payable'],
  },
  revenues: {
    tags: [],
  },
  costs: {
    tags: [],
  },
  expenses: {
    tags: [],
  },
  taxes: {
    tags: [],
  },
} as const;

type TConstructorInput = {
  id: number;
  name: TagName;
};

export class Tag {
  id: number;
  name: TagName;

  constructor(input: TConstructorInput) {
    this.id = input.id;
    this.name = input.name;
  }

  public static check(account: Account, tagName: TagName): boolean {
    if (!account.subgroup.value || account.tags.length > 0) return false;
    const tags = [...accountSubgroupTags[account.subgroup.value].tags];
    return tags.includes(tagName.value);
  }
}
