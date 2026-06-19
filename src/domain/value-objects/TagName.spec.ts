import { Exception } from '@/Exception';
import { TagName } from './TagName';

describe('TagName value object', () => {
  it('should be able to instance a TagName', () => {
    const tagName = new TagName('bank');
    expect(tagName.value).toBe('bank');
    expect(() => {
      new TagName('wrong-tag');
    }).toThrow(Exception);
  });
});
