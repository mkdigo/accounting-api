import { randomUUID } from 'crypto';

type TConstructorInput = {
  id: string;
  user_id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

type TCreateInput = {
  user_id: string;
  name: string;
};

export class Company {
  public id: string;
  public user_id: string;
  public name: string;
  public created_at: Date;
  public updated_at: Date;

  constructor(input: TConstructorInput) {
    this.id = input.id;
    this.user_id = input.user_id;
    this.name = input.name;
    this.created_at = input.created_at;
    this.updated_at = input.updated_at;
  }

  public static create(input: TCreateInput): Company {
    const uuid = randomUUID();
    const now = new Date();
    return new Company({
      ...input,
      id: uuid,
      created_at: now,
      updated_at: now,
    });
  }
}
