import { resolve, dirname } from 'node:path';
import { readFileSync } from 'fs';
import { ServiceFactory } from '../factories/ServiceFactory';
import { Exception } from '@/Exception';
import { Email } from '@/domain/value-objects/Email';

type TSendInput = {
  email: Email;
  code: string;
  subject: string;
};

export class VerificationCodeMail {
  public async send({ email, code, subject }: TSendInput): Promise<void> {
    try {
      const __dirname = dirname(__filename);
      const file = readFileSync(
        resolve(__dirname, './templates/verificationCodeEmail.html'),
      );
      const html = file
        .toString()
        .replaceAll('--code--', code)
        .replace('--subject--', subject);

      const mail = ServiceFactory.getMail();
      await mail.send({
        to: [email],
        subject,
        html,
      });
    } catch (e: any) {
      throw new Exception({
        code: 500,
        message: e.message,
      });
    }
  }
}
