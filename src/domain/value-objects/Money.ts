import { Exception } from '@/Exception';
import { Prisma } from '@/infra/database/prisma/generated/client';

export class Money {
  private readonly _value: Prisma.Decimal;

  private constructor(value: Prisma.Decimal) {
    this._value = value.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  }

  public static fromString(value: string): Money {
    try {
      return new Money(new Prisma.Decimal(value));
    } catch (error: any) {
      throw new Exception({
        code: 400,
        message: error.message,
      });
    }
  }

  public static fromNumber(value: number): Money {
    try {
      return new Money(new Prisma.Decimal(value));
    } catch (error: any) {
      throw new Exception({
        code: 400,
        message: error.message,
      });
    }
  }

  public sum(other: Money): Money {
    const result = this._value.plus(other._value);
    return new Money(result);
  }

  public sub(other: Money): Money {
    const result = this._value.sub(other._value);
    return new Money(result);
  }

  public mul(other: Money): Money {
    const result = this._value.mul(other._value);
    return new Money(result);
  }

  public div(other: Money): Money {
    const result = this._value.div(other._value);
    return new Money(result);
  }

  public isNegative(): boolean {
    return this._value.isNegative();
  }

  public isEqual(other: Money): boolean {
    return this._value.equals(other._value);
  }

  public toString(): string {
    return this._value.toFixed(2);
  }

  public toNumber(): number {
    return this._value.toNumber();
  }
}
