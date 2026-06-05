import { Token } from '../entities/Token';

export type TTokenCreateInput = {
  id: string;
  user_id: string;
};

export interface ITokenRepository {
  create(input: TTokenCreateInput): Promise<Token>;
  findById(id: string): Promise<Token | null>;
  ban(id: string): Promise<void>;
  banAll(userId: string): Promise<void>;
}
