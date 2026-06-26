import { Exception } from '@/Exception';
import { Money } from './Money';

describe('Money', () => {
  it('should be able to sum two numbers', () => {
    const number1 = Money.fromString('15.99');
    const number2 = Money.fromString('3.33');
    const result = number1.sum(number2);
    expect(result.toString()).toBe('19.32');
    expect(result.toNumber()).toBe(19.32);
  });

  it('should be able to subtract two numbers', () => {
    const number1 = Money.fromString('15.99');
    const number2 = Money.fromString('3.33');
    const result = number1.sub(number2);
    expect(result.toString()).toBe('12.66');
    expect(result.toNumber()).toBe(12.66);
  });

  it('should be able to multiply two numbers', () => {
    const number1 = Money.fromString('15.99');
    const number2 = Money.fromString('3.33');
    const result = number1.mul(number2);
    expect(result.toString()).toBe('53.25');
    expect(result.toNumber()).toBe(53.25);
  });

  it('should be able to divide two numbers', () => {
    const number1 = Money.fromString('15.99');
    const number2 = Money.fromString('3.33');
    const result = number1.div(number2);
    expect(result.toString()).toBe('4.80');
    expect(result.toNumber()).toBe(4.8);
  });

  it('should be able check if two numbers is equal', () => {
    const number1 = Money.fromString('15.99');
    const number2 = Money.fromNumber(15.99);
    const result = number1.isEqual(number2);
    expect(result).toBe(true);
    const number3 = Money.fromString('15.98');
    const result2 = number1.isEqual(number3);
    expect(result2).toBe(false);
  });

  it('should be able check if the number is negative', () => {
    const number1 = Money.fromString('15.99');
    const number2 = Money.fromNumber(-2);
    const result = number1.mul(number2);
    expect(result.isNegative()).toBe(true);
    expect(number1.isNegative()).toBe(false);
  });

  it('should not be able to instance a Money with invalid value', () => {
    try {
      Money.fromString('2000,00');
    } catch (error: any) {
      expect(error).toBeInstanceOf(Exception);
    }
  });
});
