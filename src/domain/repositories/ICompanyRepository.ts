import { Company } from '../entities/Company';

export type TCreateInput = {
  user_id: string;
  name: string;
};

export type TUpdateInput = Omit<TCreateInput, 'user_id'>;

export interface ICompanyRepository {
  findById(id: string): Promise<Company | null>;
  listByUserId(user_id: string): Promise<Company[]>;
  create(input: TCreateInput): Promise<Company>;
  update(id: string, input: TUpdateInput): Promise<Company>;
  delete(id: string): Promise<void>;
}
