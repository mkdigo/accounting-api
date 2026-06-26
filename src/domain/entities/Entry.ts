import { randomUUID } from 'crypto';
import { Money } from '../value-objects/Money';
import { Account } from './Account';

type TConstructorInput = {
  id: string;
  company_id: string;
  inclusion: Date;
  debit_id: string;
  debit_name: string;
  credit_id: string;
  credit_name: string;
  value: Money;
  note: string;
  created_at: Date;
  updated_at: Date;
};

type TCreateInput = {
  company_id: string;
  inclusion: Date;
  debitAccount: Account;
  creditAccount: Account;
  value: Money;
  note: string;
};

export class Entry {
  public id: string;
  public company_id: string;
  public inclusion: Date;
  public debit_id: string;
  public debit_name: string;
  public credit_id: string;
  public credit_name: string;
  public value: Money;
  public note: string;
  public created_at: Date;
  public updated_at: Date;

  constructor(input: TConstructorInput) {
    this.id = input.id;
    this.company_id = input.company_id;
    this.inclusion = input.inclusion;
    this.debit_id = input.debit_id;
    this.debit_name = input.debit_name;
    this.credit_id = input.credit_id;
    this.credit_name = input.credit_name;
    this.value = input.value;
    this.note = input.note;
    this.created_at = input.created_at;
    this.updated_at = input.updated_at;
  }

  public static create(input: TCreateInput): Entry {
    const uuid = randomUUID();
    const now = new Date();
    return new Entry({
      ...input,
      id: uuid,
      debit_id: input.debitAccount.id,
      debit_name: input.debitAccount.name,
      credit_id: input.creditAccount.id,
      credit_name: input.creditAccount.name,
      created_at: now,
      updated_at: now,
    });
  }
}
