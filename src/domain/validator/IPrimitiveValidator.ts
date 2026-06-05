export interface IPrimitiveValidator {
  string(value: any): string;
  number(value: any): number;
  boolean(value: any): boolean;
}
