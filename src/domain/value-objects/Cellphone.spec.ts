import { Exception } from '@/Exception';
import { Cellphone } from './Cellphone';

describe('Cellphone Value Object', () => {
  it('should be able to instance a cellphone', () => {
    expect(new Cellphone('+55 (11) 91234-1234')).toBeInstanceOf(Cellphone);
    expect(new Cellphone('(11) 91234-1234')).toBeInstanceOf(Cellphone);
  });

  it('should throw an Exception', () => {
    expect(() => {
      new Cellphone('+55(11) 91234-1234');
    }).toThrow(Exception);
    expect(() => {
      new Cellphone('+55 (11) 12345-1234');
    }).toThrow(Exception);
    expect(() => {
      new Cellphone('+55 (11) 912341234');
    }).toThrow(Exception);
    expect(() => {
      new Cellphone('55 (11) 91234-1234');
    }).toThrow(Exception);
    expect(() => {
      new Cellphone('11 91234-1234');
    }).toThrow(Exception);
  });
});
