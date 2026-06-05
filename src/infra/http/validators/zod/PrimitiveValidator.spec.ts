import { Exception } from '@/Exception';
import { PrimitiveValidator } from './PrimitiveValidator';

describe('PrimitiveValidator', () => {
  const primitiveValidator = new PrimitiveValidator();

  it('should be able to validate a string', () => {
    const value = primitiveValidator.string('test');
    expect(value).toBe('test');
    expect(() => {
      primitiveValidator.string(123);
    }).toThrow(Exception);
  });

  it('should be able to validate a number', () => {
    const value = primitiveValidator.number(999);
    expect(value).toBe(999);
    const value2 = primitiveValidator.number('123');
    expect(value2).toBe(123);
    expect(() => {
      primitiveValidator.number('test');
    }).toThrow(Exception);
  });

  it('should be able to validate a boolean', () => {
    const value = primitiveValidator.boolean(true);
    expect(value).toBe(true);
    const value2 = primitiveValidator.boolean(false);
    expect(value2).toBe(false);
    expect(() => {
      const test = primitiveValidator.boolean('test');
    }).toThrow(Exception);
  });
});
