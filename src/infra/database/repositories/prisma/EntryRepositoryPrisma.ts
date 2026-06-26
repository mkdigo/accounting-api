import { Entry } from '@/domain/entities/Entry';
import {
  IEntryRepository,
  TEntryCreateInput,
  TEntryListInput,
  TEntryUpdateInput,
} from '@/domain/repositories/IEntryRepository';
import { Prisma } from './Prisma';
import { Money } from '@/domain/value-objects/Money';

export class EntryRepositoryPrisma extends Prisma implements IEntryRepository {
  async findById(id: string): Promise<Entry | null> {
    const entry = await this.prisma.entry.findFirst({
      where: {
        id,
      },
      include: {
        debitAccount: true,
        creditAccount: true,
      },
    });
    if (!entry) return null;
    return new Entry({
      id: entry.id,
      inclusion: entry.inclusion,
      company_id: entry.company_id,
      debit_id: entry.debit_id,
      debit_name: entry.debitAccount.name,
      credit_id: entry.credit_id,
      credit_name: entry.creditAccount.name,
      value: Money.fromString(entry.value.toFixed(2)),
      note: entry.note,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
    });
  }
  async list(input: TEntryListInput): Promise<Entry[]> {
    const entries = await this.prisma.entry.findMany({
      where: {
        company_id: input.companyId,
        inclusion: {
          gte: input.start,
          lte: input.end,
        },
        AND: input.subgroup
          ? {
              OR: [
                {
                  debitAccount: {
                    subgroup: {
                      equals: input.subgroup.value,
                    },
                  },
                },
                {
                  creditAccount: {
                    subgroup: {
                      equals: input.subgroup.value,
                    },
                  },
                },
              ],
            }
          : undefined,
        OR: [
          {
            note: {
              contains: input.search,
              mode: 'insensitive',
            },
          },
          {
            debitAccount: {
              name: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          },
          {
            creditAccount: {
              name: {
                contains: input.search,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
      include: {
        debitAccount: true,
        creditAccount: true,
      },
      orderBy: [
        {
          inclusion: 'desc',
        },
        {
          created_at: 'desc',
        },
        {
          id: 'desc',
        },
      ],
      take: input.take ?? 50,
      cursor: input.lastId
        ? {
            id: input.lastId,
          }
        : undefined,
      skip: input.lastId ? 1 : undefined,
    });
    return entries.map(
      (entry) =>
        new Entry({
          id: entry.id,
          inclusion: entry.inclusion,
          company_id: entry.company_id,
          debit_id: entry.debit_id,
          debit_name: entry.debitAccount.name,
          credit_id: entry.credit_id,
          credit_name: entry.creditAccount.name,
          value: Money.fromString(entry.value.toFixed(2)),
          note: entry.note,
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        }),
    );
  }

  async create(input: TEntryCreateInput): Promise<Entry> {
    const entry = Entry.create({
      ...input,
      company_id: input.companyId,
    });
    const createdEntry = await this.prisma.entry.create({
      data: {
        id: entry.id,
        company_id: entry.company_id,
        inclusion: entry.inclusion,
        debit_id: entry.debit_id,
        credit_id: entry.credit_id,
        value: entry.value.toNumber(),
        note: entry.note,
      },
      include: {
        debitAccount: true,
        creditAccount: true,
      },
    });
    return new Entry({
      id: createdEntry.id,
      company_id: createdEntry.company_id,
      inclusion: createdEntry.inclusion,
      debit_id: createdEntry.debit_id,
      debit_name: createdEntry.debitAccount.name,
      credit_id: createdEntry.credit_id,
      credit_name: createdEntry.creditAccount.name,
      value: Money.fromString(createdEntry.value.toFixed(2)),
      note: createdEntry.note,
      created_at: createdEntry.created_at,
      updated_at: createdEntry.updated_at,
    });
  }

  async update(id: string, input: TEntryUpdateInput): Promise<Entry> {
    const updatedEntry = await this.prisma.entry.update({
      where: {
        id,
      },
      data: {
        inclusion: input.inclusion,
        debit_id: input.debitAccount.id,
        credit_id: input.creditAccount.id,
        value: input.value.toNumber(),
        note: input.note,
      },
      include: {
        debitAccount: true,
        creditAccount: true,
      },
    });
    return new Entry({
      id: updatedEntry.id,
      company_id: updatedEntry.company_id,
      inclusion: updatedEntry.inclusion,
      debit_id: updatedEntry.debit_id,
      debit_name: updatedEntry.debitAccount.name,
      credit_id: updatedEntry.credit_id,
      credit_name: updatedEntry.creditAccount.name,
      value: Money.fromString(updatedEntry.value.toFixed(2)),
      note: updatedEntry.note,
      created_at: updatedEntry.created_at,
      updated_at: updatedEntry.updated_at,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.entry.delete({
      where: {
        id,
      },
    });
  }
}
