import { Code, TCodeType } from '../entities/Code';

export type TCreateInput = {
  userId: string;
  code: string;
  type: TCodeType;
};

export type TAttemptsUpdateInput = {
  id: string;
  attempts: number;
};

export interface ICodeRepository {
  create(input: TCreateInput): Promise<Code>;
  findById(id: string): Promise<Code | null>;
  findByUserId(userId: string): Promise<Code | null>;
  attemptsUpdate(input: TAttemptsUpdateInput): Promise<Code>;
  deleteAll(userId: string): Promise<void>;
}
