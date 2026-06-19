import { Tag } from '../entities/Tag';
import { TagName } from '../value-objects/TagName';

export type TTagCreateInput = {
  tagName: TagName;
};

export type TTagUpdateInput = TTagCreateInput;

export interface ITagRepository {
  list(): Promise<Tag[]>;
  findByName(tagName: TagName): Promise<Tag | null>;
  create(input: TTagCreateInput): Promise<Tag>;
  update(id: number, input: TTagUpdateInput): Promise<Tag>;
  delete(id: number): Promise<void>;
}
