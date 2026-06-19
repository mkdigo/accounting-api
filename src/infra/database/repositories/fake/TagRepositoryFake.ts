import { Tag } from '@/domain/entities/Tag';
import {
  ITagRepository,
  TTagCreateInput,
  TTagUpdateInput,
} from '@/domain/repositories/ITagRepository';
import { TagName } from '@/domain/value-objects/TagName';
import { Exception } from '@/Exception';

const initialTags = [
  'bank',
  'accounts_receivable',
  'accounts_payable',
  'credit_card',
] as const;

export class TagRepositoryFake implements ITagRepository {
  private tags: Tag[] = [];

  constructor() {
    this.tags = initialTags.map(
      (tag, i) => new Tag({ id: i, name: new TagName(tag) }),
    );
  }

  async list(): Promise<Tag[]> {
    return this.tags;
  }

  async findByName(name: TagName): Promise<Tag | null> {
    const filter = this.tags.filter((tag) => tag.name.value === name.value);
    if (filter.length === 0) return null;
    return filter[0];
  }

  async create(input: TTagCreateInput): Promise<Tag> {
    const tag = new Tag({ id: this.tags.length + 1, name: input.tagName });
    this.tags.push(tag);
    return tag;
  }

  async update(id: number, input: TTagUpdateInput): Promise<Tag> {
    const filter = this.tags.filter((tag) => tag.id === id);
    if (filter.length === 0)
      throw new Exception({ code: 404, message: 'Tag not found' });
    const foundTag = new Tag({ ...filter[0], name: input.tagName });
    this.tags = this.tags.map((tag) => {
      if (tag.id !== id) return tag;
      return foundTag;
    });
    return foundTag;
  }

  async delete(id: number): Promise<void> {
    const filter = this.tags.filter((tag) => tag.id === id);
    if (filter.length === 0)
      throw new Exception({ code: 404, message: 'Tag not found' });
    this.tags.filter((tag) => tag.id !== id);
  }
}
