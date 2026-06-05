type TConstructorInput = {
  id: string;
  user_id: string;
  is_banned: boolean;
};

export class Token {
  public id: string;
  public user_id: string;
  public is_banned: boolean;

  constructor(input: TConstructorInput) {
    this.id = input.id;
    this.user_id = input.user_id;
    this.is_banned = input.is_banned;
  }
}
