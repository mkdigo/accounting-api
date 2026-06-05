import { StringValue } from 'ms';
import { Exception } from './Exception';
import { ValidatorFactory } from './infra/factories/ValidatorFactory';

const NODE_ENV = process.env.NODE_ENV;
const APP_PORT = !isNaN(Number(process.env.APP_PORT))
  ? Number(process.env.APP_PORT)
  : 3000;

const LOGGER = process.env.LOGGER === 'true' ? true : false;
const APP_SECRET = process.env.APP_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Exception({ message: 'JWT_SECRET undefined!' });
const JWT_EXPIRES_IN: StringValue =
  (process.env.JWT_EXPIRES_IN as StringValue) || '1h';

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_TLS = process.env.MAIL_TLS === 'true' ? true : false;
const MAIL_FROM = process.env.MAIL_FROM;

const DATABASE_URL = process.env.DATABASE_URL;

const data = {
  NODE_ENV,
  APP_PORT,
  LOGGER,
  APP_SECRET,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_TLS,
  MAIL_FROM,
  DATABASE_URL,
};

const envFileValidator = ValidatorFactory.getEnvFileValidator();

const env = envFileValidator.execute(data);

export { env };
