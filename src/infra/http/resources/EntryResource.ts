import { Entry } from '@/domain/entities/Entry';

type TOutput = {
  id: string;
  company_id: string;
  inclusion: string;
  debit_id: string;
  debit_name: string;
  credit_id: string;
  credit_name: string;
  value: number;
  note: string;
  created_at: string;
  updated_at: string;
};

export class EntryResource {
  public single(entry: Entry): TOutput {
    return {
      id: entry.id,
      company_id: entry.company_id,
      inclusion: entry.inclusion.toISOString().split('T')[0],
      debit_id: entry.debit_id,
      debit_name: entry.debit_name,
      credit_id: entry.credit_id,
      credit_name: entry.credit_name,
      value: entry.value.toNumber(),
      note: entry.note,
      created_at: entry.created_at.toISOString(),
      updated_at: entry.updated_at.toISOString(),
    };
  }

  public collection(entries: Entry[]): TOutput[] {
    return entries.map((entry) => this.single(entry));
  }
}
