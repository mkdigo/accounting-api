import { Exception } from '@/Exception';
import { Email } from './Email';

describe('Email Value Object', () => {
  it('should be able to instance an Email', () => {
    expect(new Email('contato@exemplo.com.br')).toBeInstanceOf(Email);
    expect(new Email('contato@exemplo.co.jp')).toBeInstanceOf(Email);
    expect(new Email('contato@exemplo.com')).toBeInstanceOf(Email);
  });

  it('should throw an error', () => {
    const address = 'contatoexemplo.com.br';
    expect(() => {
      new Email(address);
    }).toThrow(Exception);
  });
});
