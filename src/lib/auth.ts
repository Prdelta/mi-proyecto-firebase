import { cookies } from 'next/headers';
import { findUserById } from '@/lib/data';
import type { User } from './definitions';

const SESSION_COOKIE_NAME = 'unap_session';
// In a real app, this would be in an environment variable.
const SESSION_SECRET = 'a_very_secret_and_long_string_for_testing_purposes_only';

// A very simple "encryption". In a real app, use a library like 'jose'.
const encrypt = (text: string) => Buffer.from(text).toString('base64');
const decrypt = (text: string) => Buffer.from(text, 'base64').toString('ascii');

type SessionPayload = {
  userId: number;
  expires: Date;
};

export async function createSession(userId: number) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  const session: SessionPayload = { userId, expires };

  const encryptedSession = encrypt(JSON.stringify(session));

  cookies().set(SESSION_COOKIE_NAME, encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<{ user: User | null; isLoggedIn: boolean }> {
  const cookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return { user: null, isLoggedIn: false };

  try {
    const session: SessionPayload = JSON.parse(decrypt(cookie));
    if (new Date() > new Date(session.expires)) {
      await deleteSession();
      return { user: null, isLoggedIn: false };
    }

    const user = await findUserById(session.userId);
    return { user: user || null, isLoggedIn: !!user };
  } catch (error) {
    return { user: null, isLoggedIn: false };
  }
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
