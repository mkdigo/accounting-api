import { Account } from '../entities/Account';
import { Entry } from '../entities/Entry';
import { AccountSubgroup } from '../value-objects/AccountSubgroup';
import { Money } from '../value-objects/Money';

export type TEntryListInput = {
  companyId: string;
  start: Date;
  end: Date;
  search: string;
  take?: number;
  lastId?: string;
  subgroup?: AccountSubgroup;
};

export type TEntryCreateInput = {
  companyId: string;
  inclusion: Date;
  debitAccount: Account;
  creditAccount: Account;
  value: Money;
  note: string;
};

export type TEntryUpdateInput = Omit<TEntryCreateInput, 'companyId'>;

export interface IEntryRepository {
  findById(id: string): Promise<Entry | null>;
  list(input: TEntryListInput): Promise<Entry[]>;
  create(input: TEntryCreateInput): Promise<Entry>;
  update(id: string, input: TEntryUpdateInput): Promise<Entry>;
  delete(id: string): Promise<void>;
}
