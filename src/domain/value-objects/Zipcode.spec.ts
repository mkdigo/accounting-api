import { Exception } from '@/Exception';
import { Zipcode } from './Zipcode';

describe('Zipcode Value Object', () => {
  it('should be able to instance a zipcode', () => {
    expect(new Zipcode('12345-123')).toBeInstanceOf(Zipcode);
  });

  it('should throw an Exception', () => {
    expect(() => {
      new Zipcode('123');
    }).toThrow(Exception);
    expect(() => {
      new Zipcode('1234-123');
    }).toThrow(Exception);
    expect(() => {
      new Zipcode('12345-12');
    }).toThrow(Exception);
  });
});
