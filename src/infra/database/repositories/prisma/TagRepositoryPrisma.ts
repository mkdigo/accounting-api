import { Prisma } from './Prisma';
import {
  ITagRepository,
  TTagCreateInput,
  TTagUpdateInput,
} from '@/domain/repositories/ITagRepository';
import { Tag } from '@/domain/entities/Tag';
import { TagName } from '@/domain/value-objects/TagName';
import { Exception } from '@/Exception';

export class TagRepositoryPrisma extends Prisma implements ITagRepository {
  async list(): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return tags.map(
      (tag) => new Tag({ id: tag.id, name: new TagName(tag.name) }),
    );
  }

  async findByName(tagName: TagName): Promise<Tag | null> {
    const tag = await this.prisma.tag.findFirst({
      where: {
        name: tagName.value,
      },
    });
    return tag ? new Tag({ id: tag.id, name: new TagName(tag.name) }) : null;
  }

  async create(input: TTagCreateInput): Promise<Tag> {
    const tag = await this.prisma.tag.create({
      data: {
        name: input.tagName.value,
      },
    });
    return new Tag({ id: tag.id, name: new TagName(tag.name) });
  }

  async update(id: number, input: TTagUpdateInput): Promise<Tag> {
    const foundTag = this.prisma.tag.findFirst({
      where: {
        id,
      },
    });
    if (!foundTag) throw new Exception({ code: 404, message: 'Tag not found' });
    const tag = await this.prisma.tag.update({
      where: {
        id,
      },
      data: {
        name: input.tagName.value,
      },
    });
    return new Tag({ id: tag.id, name: new TagName(tag.name) });
  }

  async delete(id: number): Promise<void> {
    const foundTag = this.prisma.tag.findFirst({
      where: {
        id,
      },
    });
    if (!foundTag) throw new Exception({ code: 404, message: 'Tag not found' });
    await this.prisma.tag.delete({
      where: { id },
    });
  }
}
