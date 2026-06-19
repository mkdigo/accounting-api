import { Exception } from '@/Exception';

const availableTags = [
  'bank',
  'accounts_receivable',
  'accounts_payable',
  'credit_card',
] as const;

type TTagName = (typeof availableTags)[number];

export class TagName {
  readonly value: TTagName;

  constructor(value: string) {
    if (!availableTags.includes(value as any))
      throw new Exception({
        code: 400,
        message: `Invalid tag: ${value}`,
        errors: { tags: [`Invalid tag: ${value}`] },
      });
    this.value = value as any;
  }
}
