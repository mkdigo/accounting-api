import { Account } from '@/domain/entities/Account';
import { Tag } from '@/domain/entities/Tag';
import {
  IAccountRepository,
  TAccountCreateInput,
  TAccountListInput,
  TAccountUpdateInput,
} from '@/domain/repositories/IAccountRepository';
import { ITagRepository } from '@/domain/repositories/ITagRepository';
import { TagName } from '@/domain/value-objects/TagName';
import { AccountGroup } from '@/domain/value-objects/AccountGroup';
import { AccountSubgroup } from '@/domain/value-objects/AccountSubgroup';

import { Prisma } from './Prisma';
import { TagRepositoryPrisma } from './TagRepositoryPrisma';

import { Exception } from '@/Exception';
import { AccountWhereInput } from '../../prisma/generated/models';

export class AccountRepositoryPrisma
  extends Prisma
  implements IAccountRepository
{
  private tagRepository: ITagRepository;

  constructor() {
    super();
    this.tagRepository = new TagRepositoryPrisma();
  }

  async list(input: TAccountListInput): Promise<Account[]> {
    let where: AccountWhereInput = {
      company_id: input.companyId,
      name: {
        contains: input.name,
        mode: 'insensitive',
      },
      group: {
        equals: input.group?.value,
      },
      subgroup: {
        equals: input.subgroup?.value,
      },
    };
    if (input.tagName) {
      where.tags = {
        some: {
          tag: {
            name: input.tagName.value,
          },
        },
      };
    }
    const accounts = await this.prisma.account.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return accounts.map(
      (account) =>
        new Account({
          ...account,
          group: new AccountGroup(account.group),
          subgroup: new AccountSubgroup(account.subgroup),
          tags: account.tags.map(
            (item) =>
              new Tag({ id: item.tag.id, name: new TagName(item.tag.name) }),
          ),
        }),
    );
  }

  async findById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findFirst({
      where: {
        id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    if (!account) return null;
    return new Account({
      ...account,
      group: new AccountGroup(account.group),
      subgroup: new AccountSubgroup(account.subgroup),
      tags: account.tags.map(
        (item) =>
          new Tag({ id: item.tag.id, name: new TagName(item.tag.name) }),
      ),
    });
  }

  async create(input: TAccountCreateInput): Promise<Account> {
    const tags: Tag[] = [];
    for (const tagName of input.tags) {
      const tag = await this.tagRepository.findByName(new TagName(tagName));
      if (tag) tags.push(new Tag(tag));
    }
    const account = Account.create({ ...input, tags });
    await this.prisma.account.create({
      data: {
        ...account,
        group: account.group.value,
        subgroup: account.subgroup.value,
        tags: {
          create: tags.map((tag) => ({
            tag: {
              connect: {
                id: tag.id,
              },
            },
          })),
        },
      },
    });
    return account;
  }

  async update(id: string, input: TAccountUpdateInput): Promise<Account> {
    const foundAccount = await this.findById(id);
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });

    const account = await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        name: input.name,
        group: input.group.value,
        subgroup: input.subgroup.value,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return new Account({
      ...account,
      group: new AccountGroup(account.group),
      subgroup: new AccountSubgroup(account.subgroup),
      tags: account.tags.map(
        (item) =>
          new Tag({ id: item.tag.id, name: new TagName(item.tag.name) }),
      ),
    });
  }

  async delete(id: string): Promise<void> {
    const foundAccount = this.prisma.account.findFirst({
      where: { id },
    });
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    await this.prisma.account.delete({
      where: {
        id,
      },
    });
  }

  async addTag(id: string, tagName: TagName): Promise<Account> {
    const foundAccount = await this.prisma.account.findFirst({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const tag = await this.tagRepository.findByName(tagName);
    if (!tag) throw new Exception({ code: 404, message: 'Tag not found' });
    const account = await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        tags: {
          create: {
            tag: {
              connect: {
                id: tag.id,
              },
            },
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return new Account({
      ...account,
      group: new AccountGroup(account.group),
      subgroup: new AccountSubgroup(account.subgroup),
      tags: account.tags.map(
        (item) =>
          new Tag({ id: item.tag.id, name: new TagName(item.tag.name) }),
      ),
    });
  }

  async removeTag(id: string, tagName: TagName): Promise<Account> {
    const foundAccount = await this.prisma.account.findFirst({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    if (!foundAccount)
      throw new Exception({ code: 404, message: 'Account not found' });
    const hasTag = foundAccount.tags.some(
      (tag) => tag.tag.name === tagName.value,
    );
    const tag = await this.tagRepository.findByName(tagName);
    if (!tag || !hasTag)
      throw new Exception({ code: 404, message: 'Tag not found' });
    const account = await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        tags: {
          delete: {
            account_id_tag_id: {
              tag_id: tag.id,
              account_id: id,
            },
          },
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return new Account({
      ...account,
      group: new AccountGroup(account.group),
      subgroup: new AccountSubgroup(account.subgroup),
      tags: account.tags.map(
        (item) =>
          new Tag({ id: item.tag.id, name: new TagName(item.tag.name) }),
      ),
    });
  }
}
