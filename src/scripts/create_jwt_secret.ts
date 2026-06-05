import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

function createJwtSecret() {
  const arg = process.argv.slice(2)[0];
  const secretKey = crypto.randomBytes(64).toString('hex');
  const jwtSecretLine = `JWT_SECRET=${secretKey}`;
  const jwtExpiresInLine = 'JWT_EXPIRES_IN=1h';
  const envPath = path.resolve(
    process.cwd(),
    `.env.${arg === 'production' ? 'production' : 'development'}`,
  );

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, `${jwtSecretLine}\n${jwtExpiresInLine}`);
    return;
  }

  let content = fs.readFileSync(envPath, 'utf-8');
  const jwtSecretRegex = new RegExp('JWT_SECRET(.+)?');
  const jwtExpiresInRegex = new RegExp('JWT_EXPIRES_IN(.+)?');

  if (jwtSecretRegex.test(content)) {
    content = content.replace(jwtSecretRegex, jwtSecretLine);
  } else {
    content = `${content}\n${jwtSecretLine}`;
  }

  if (jwtExpiresInRegex.test(content)) {
    content = content.replace(jwtExpiresInRegex, jwtExpiresInLine);
  } else {
    content = `${content}\n${jwtExpiresInLine}`;
  }

  fs.writeFileSync(envPath, content);
}

try {
  createJwtSecret();
  console.info(
    '\x1b[32m%s\x1b[0m',
    'JWT_SECRET successfully created in the .env file.',
  );
} catch (erro: any) {
  console.error('❌ Error manipulating the .env file:', erro.message);
}
