import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

function createJwtSecret() {
  const arg = process.argv.slice(2)[0];
  const secretKey = crypto.randomBytes(64).toString('hex');
  const appSecretLine = `APP_SECRET=${secretKey}`;
  const envPath = path.resolve(
    process.cwd(),
    `.env.${arg === 'production' ? 'production' : 'development'}`,
  );

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, `${appSecretLine}`);
    return;
  }

  let content = fs.readFileSync(envPath, 'utf-8');
  const appSecretRegex = new RegExp('APP_SECRET(.+)?');

  if (appSecretRegex.test(content)) {
    content = content.replace(appSecretRegex, appSecretLine);
  } else {
    content = `${content}\n${appSecretLine}`;
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
