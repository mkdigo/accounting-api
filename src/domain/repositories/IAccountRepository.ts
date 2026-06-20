import { Account } from '../entities/Account';
import { AccountGroup } from '../value-objects/AccountGroup';
import { AccountSubgroup } from '../value-objects/AccountSubgroup';
import { TagName } from '../value-objects/TagName';

export type TAccountListInput = {
  companyId: string;
  name?: string;
  group?: AccountGroup;
  subgroup?: AccountSubgroup;
  tagName?: TagName;
};

export type TAccountCreateInput = {
  company_id: string;
  name: string;
  group: AccountGroup;
  subgroup: AccountSubgroup;
  tags: string[];
};

export type TAccountUpdateInput = Omit<
  TAccountCreateInput,
  'company_id' | 'tags'
>;

export interface IAccountRepository {
  list(params: TAccountListInput): Promise<Account[]>;
  findById(id: string): Promise<Account | null>;
  create(input: TAccountCreateInput): Promise<Account>;
  update(id: string, input: TAccountUpdateInput): Promise<Account>;
  delete(id: string): Promise<void>;
  addTag(accountId: string, tagName: TagName): Promise<Account>;
  removeTag(accountId: string, tagName: TagName): Promise<Account>;
}
