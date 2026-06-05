import { randomUUID } from 'crypto';
import { JWTTokenManager } from './JWTTokenManager';
import { TPayload } from '@/domain/auth/ITokenManager';

describe('JWTToken', () => {
  it('should be able to create a token', () => {
    const payload: TPayload = {
      userId: randomUUID(),
      type: 'default',
    };
    const jwtToken = new JWTTokenManager();
    const token = jwtToken.create(payload);
    expect(token).toBeDefined();
    const decoded = jwtToken.verify(token.content);
    expect(decoded).toMatchObject(payload);
  });
});
