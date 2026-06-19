import { randomUUID } from 'crypto';
import { Tag } from './Tag';
import { AccountGroup } from '../value-objects/AccountGroup';
import { AccountSubgroup } from '../value-objects/AccountSubgroup';

type TConstructorInput = {
  id: string;
  company_id: string;
  name: string;
  group: AccountGroup;
  subgroup: AccountSubgroup;
  tags: Tag[];
};

type TCreateInput = Omit<TConstructorInput, 'id'>;

export class Account {
  id: string;
  company_id: string;
  name: string;
  group: AccountGroup;
  subgroup: AccountSubgroup;
  tags: Tag[];

  constructor(input: TConstructorInput) {
    this.id = input.id;
    this.company_id = input.company_id;
    this.name = input.name;
    this.group = input.group;
    this.subgroup = input.subgroup;
    this.tags = input.tags;
  }

  public static create(input: TCreateInput): Account {
    const uuid = randomUUID();
    return new Account({ id: uuid, ...input });
  }
}
