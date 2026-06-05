import { Nodemailer } from './Nodemailer';
import { Email } from '@/domain/value-objects/Email';

describe('Nodemailer', () => {
  it('should be able to send an email', async () => {
    try {
      const mail = new Nodemailer();
      await mail.send({
        to: [new Email('user1@mail.com'), new Email('user2@mail.com')],
        subject: 'Testing',
        text: 'Testing 123',
      });
      expect(true).toBe(true);
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
