import { Exception } from '@/Exception';
import { AccountGroup } from './AccountGroup';

describe('AccountGroup value object', () => {
  it('should be able to instance a AccountGroup', () => {
    const accountGroup = new AccountGroup('assets');
    expect(accountGroup.value).toBe('assets');
    expect(() => {
      new AccountGroup('wrongValue' as any);
    }).toThrow(Exception);
  });
});
