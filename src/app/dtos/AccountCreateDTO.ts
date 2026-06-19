import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

export type TAccountCreateInput = {
  company_id: string;
  name: string;
  group: AccountGroup;
  subgroup: AccountSubgroup;
  tags: string[];
};
