import { Account } from '@/domain/entities/Account';

type TOutput = {
  id: string;
  company_id: string;
  name: string;
  group: string;
  subgroup: string | null;
  tags: string[];
};

export class AccountResource {
  public single(account: Account): TOutput {
    return {
      id: account.id,
      company_id: account.company_id,
      name: account.name,
      group: account.group.value,
      subgroup: account.subgroup.value,
      tags: account.tags.map((tag) => tag.name.value),
    };
  }

  public collection(accounts: Account[]): TOutput[] {
    return accounts.map((account) => this.single(account));
  }
}
