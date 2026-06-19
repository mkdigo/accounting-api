import { Exception } from '@/Exception';
import { AccountSubgroup } from './AccountSubgroup';

describe('AccountSubgroup value object', () => {
  it('should be able to instance a AccountSubgroup', () => {
    const accountSubgroup = new AccountSubgroup('costs');
    expect(accountSubgroup.value).toBe('costs');
    const accountSubgroup2 = new AccountSubgroup(null);
    expect(accountSubgroup2.value).toBe(null);
    expect(() => {
      new AccountSubgroup('wrongValue' as any);
    }).toThrow(Exception);
  });
});
