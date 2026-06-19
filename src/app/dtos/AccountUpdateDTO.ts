import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

export type TAccountUpdateInput = {
  name: string;
  group: AccountGroup;
  subgroup: AccountSubgroup;
};
