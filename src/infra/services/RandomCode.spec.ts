import { RandomCode } from './RandomCode';

describe('RandomCode', () => {
  it('should be able to generate a random alphanimeric code', () => {
    const randomCode = new RandomCode();
    const code = randomCode.alphanumeric(10);
    expect(code.length).toBe(10);
  });

  it('should be able to generate a random numeric code', () => {
    const randomCode = new RandomCode();
    const code = randomCode.number(8);
    console.log(code);
    expect(code.length).toBe(8);
  });
});
