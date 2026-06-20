import { Account } from '@/domain/entities/Account';
import {
  IAccountRepository,
  TAccountCreateInput,
  TAccountListInput,
  TAccountUpdateInput,
} from '@/domain/repositories/IAccountRepository';
import { ITagRepository } from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';
import { TagName } from '@/domain/value-objects/TagName';

import { TagRepositoryFake } from './TagRepositoryFake';
import { Exception } from '@/Exception';

export class AccountRepositoryFake implements IAccountRepository {
  private accounts: Account[] = [];
  private tagRespository: ITagRepository;

  constructor() {
    this.tagRespository = new TagRepositoryFake();
  }

  async list(input: TAccountListInput): Promise<Account[]> {
    let accounts = this.accounts.filter(
      (account) => account.company_id === input.companyId,
    );
    const name = input.name ?? '';
    const group = input.group?.value ?? '';
    const subgroup = input.subgroup?.value ?? '';
    const tagName = input.tagName?.value ?? null;
    accounts = accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(name.toLowerCase()) &&
        account.group.value.includes(group) &&
        account.subgroup.value?.includes(subgroup) &&
        (!tagName ||
          account.tags.some((tag) => tag.name.value.includes(tagName))),
    );
    // accounts = accounts.filter((account) =>
    //   account.tags.some((tag) => tag.name.value.includes(tagName)),
    // );
    console.log(accounts);
    return accounts;
  }

  async findById(id: string): Promise<Account | null> {
    const filter = this.accounts.filter((account) => account.id === id);
    if (filter.length === 0) return null;
    return filter[0];
  }

  async create(input: TAccountCreateInput): Promise<Account> {
    const tags: Tag[] = [];
    for (const tagName of input.tags) {
      const tag = await this.tagRespository.findByName(new TagName(tagName));
      if (tag) tags.push(tag);
    }
    const account = Account.create({ ...input, tags });
    this.accounts.push(account);
    return account;
  }

  async update(id: string, input: TAccountUpdateInput): Promise<Account> {
    const filter = this.accounts.filter((account) => account.id === id);
    if (filter.length === 0)
      throw new Exception({ code: 404, message: 'Account not found' });
    const foundAccount = { ...filter[0], ...input };
    this.accounts = this.accounts.map((account) =>
      account.id === foundAccount.id ? foundAccount : account,
    );
    return new Account(foundAccount);
  }

  async delete(id: string): Promise<void> {
    const filter = this.accounts.filter((account) => account.id === id);
    if (filter.length === 0)
      throw new Exception({ code: 404, message: 'Account not found' });
    this.accounts = this.accounts.filter((account) => account.id !== id);
  }

  async addTag(accountId: string, tagName: TagName): Promise<Account> {
    const foundAccount = this.accounts.filter(
      (account) => account.id === accountId,
    )[0];
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const tag = await this.tagRespository.findByName(tagName);
    if (!tag) throw new Exception({ code: 404, message: 'Tag not found' });
    foundAccount.tags.push(tag);
    this.accounts = this.accounts.map((account) => {
      if (account.id !== accountId) return account;
      return { ...account, tags: [...account.tags, tag] };
    });
    return foundAccount;
  }

  async removeTag(accountId: string, tagName: TagName): Promise<Account> {
    let foundAccount = this.accounts.filter(
      (account) => account.id === accountId,
    )[0];
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const hasTag = foundAccount.tags.some(
      (tag) => tag.name.value === tagName.value,
    );
    if (!hasTag) throw new Exception({ code: 404, message: 'Tag not found' });

    this.accounts = this.accounts.map((account) => {
      if (account.id !== accountId) return account;
      const tags = account.tags.filter(
        (tag) => tag.name.value !== tagName.value,
      );
      foundAccount.tags = tags;
      return {
        ...account,
        tags,
      };
    });
    return foundAccount;
  }
}
