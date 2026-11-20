import React, {type FormEvent, type ReactNode, useEffect, useRef, useState} from 'react';
import Head from '@docusaurus/Head';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useIsBrowser from '@docusaurus/useIsBrowser';
import passwordHash from './passwordHash';
import styles from './styles.module.css';

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function isCorrectPassword(password: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: hexToBytes(passwordHash.salt),
      iterations: passwordHash.iterations,
    },
    key,
    256,
  );
  return bytesToHex(new Uint8Array(bits)) === passwordHash.hash;
}

type Status = 'idle' | 'checking' | 'wrong' | 'insecure';

const MESSAGES: Partial<Record<Status, string>> = {
  wrong: '密碼錯誤，請再試一次。',
  insecure: '此網址無法驗證密碼，請改用 https:// 開頭的網址開啟。',
};

export default function PasswordGate({onUnlock}: {onUnlock: () => void}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const isBrowser = useIsBrowser();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const faviconUrl = useBaseUrl(siteConfig.favicon ?? '');
  const logoUrl = useBaseUrl('/img/logo.svg');

  // 輸入框在 JS 載入前是停用狀態，載入後自動聚焦。
  useEffect(() => {
    if (isBrowser) {
      inputRef.current?.focus();
    }
  }, [isBrowser]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || status === 'checking') {
      return;
    }
    if (!window.crypto?.subtle) {
      setStatus('insecure');
      return;
    }
    setStatus('checking');
    if (await isCorrectPassword(password)) {
      onUnlock();
      return;
    }
    setStatus('wrong');
    setPassword('');
    inputRef.current?.focus();
  }

  const message = MESSAGES[status];

  return (
    <>
      <Head>
        <html lang="zh-Hant" />
        <title>{siteConfig.title}</title>
        {siteConfig.favicon && <link rel="icon" href={faviconUrl} />}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <main className={styles.wrapper}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <img className={styles.logo} src={logoUrl} alt="" width={48} height={48} />
          <h1 className={styles.title}>{siteConfig.title}</h1>
          <p className={styles.hint}>此為內部資料，請輸入密碼後瀏覽。</p>
          <label className={styles.srOnly} htmlFor="kb-password">
            密碼
          </label>
          <input
            ref={inputRef}
            id="kb-password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            placeholder="密碼"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (status === 'wrong') {
                setStatus('idle');
              }
            }}
            disabled={!isBrowser}
            aria-invalid={status === 'wrong'}
            aria-describedby={message ? 'kb-password-message' : undefined}
          />
          <p id="kb-password-message" className={styles.message} role="alert">
            {message}
          </p>
          <button
            type="submit"
            className="button button--primary button--block"
            disabled={!isBrowser || !password || status === 'checking'}>
            {status === 'checking' ? '驗證中…' : '進入'}
          </button>
        </form>
      </main>
    </>
  );
}
