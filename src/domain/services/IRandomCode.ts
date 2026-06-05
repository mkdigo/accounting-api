export interface IRandomCode {
  number(size?: number): string;
  alphanumeric(size?: number): string;
}
