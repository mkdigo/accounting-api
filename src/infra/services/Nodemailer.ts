import { IMail, TMailSend } from '@/domain/services/IMail';
import { env } from '@/env';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class Nodemailer implements IMail {
  private transporter: Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;

  constructor() {
    this.transporter = createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_TLS, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });
  }

  public verify = async (): Promise<true> => {
    return await this.transporter.verify();
  };

  public send = async ({ to, subject, text, html }: TMailSend) => {
    try {
      await this.transporter.sendMail({
        from: `"Powerlifting Team" <${env.MAIL_FROM}>`,
        to: to.map((email) => email.address).join(', '),
        subject,
        text,
        html,
      });
    } catch (err: any) {
      console.error('Error while sending mail:', err);
    }
  };
}
