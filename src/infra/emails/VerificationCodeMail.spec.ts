import { Email } from '@/domain/value-objects/Email';
import { VerificationCodeMail } from './VerificationCodeMail';
import { ServiceFactory } from '../factories/ServiceFactory';

describe('EmailVerificationMail', () => {
  it('should be able to send email verification code', async () => {
    try {
      const randomCode = ServiceFactory.getRancomCode();
      const code = randomCode.alphanumeric();
      const verificationCodeMail = new VerificationCodeMail();
      await verificationCodeMail.send({
        email: new Email('user@mail.com'),
        code,
        subject: 'Verifique seu e-mail',
      });
      expect(true).toBe(true);
    } catch (e) {
      expect(false).toBe(true);
    }
  });
});
