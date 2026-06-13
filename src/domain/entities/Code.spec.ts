import { Code } from './Code';

describe('Code', () => {
  it('should be able to compare two codes', () => {
    const code = Code.create({
      code: 'ABCDEF',
      type: 'password_reset',
      userId: 'asdf',
    });
    expect(code.compare('ABCDEF')).toBe(true);
    expect(code.compare('ABCDEFA')).toBe(false);
  });
});
