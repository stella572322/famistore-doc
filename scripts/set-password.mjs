#!/usr/bin/env node
// 設定知識庫的進站密碼。
// 用法：npm run set-password -- '新密碼'
// 會改寫 src/components/PasswordGate/passwordHash.ts（只存雜湊值，不存密碼原文），
// 之後 commit 並 push 到 main，網站重新部署後新密碼即生效。
import {pbkdf2Sync, randomBytes} from 'node:crypto';
import {writeFileSync} from 'node:fs';

const ITERATIONS = 100_000;

const password = process.argv[2];
if (!password) {
  console.error("用法：npm run set-password -- '新密碼'（密碼請用單引號包住）");
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = pbkdf2Sync(password, Buffer.from(salt, 'hex'), ITERATIONS, 32, 'sha256').toString('hex');

const target = new URL('../src/components/PasswordGate/passwordHash.ts', import.meta.url);
writeFileSync(
  target,
  `// 此檔由 \`npm run set-password\` 產生，請勿手動修改。
// 只存密碼的雜湊值（PBKDF2-SHA256），不含密碼原文。
const passwordHash = {
  salt: '${salt}',
  iterations: ${ITERATIONS},
  hash: '${hash}',
} as const;

export default passwordHash;
`,
);

console.log('已更新進站密碼。commit 並 push 到 main 後，網站重新部署即生效。');
