import Stream from 'stream';
import { Email } from '../value-objects/Email';

export type TMailSend = {
  to: Email[];
  subject?: string;
  text?: string;
  html?: string | Buffer<ArrayBufferLike> | Stream.Readable;
};

export interface IMail {
  send(input: TMailSend): Promise<void>;
}
