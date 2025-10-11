import { randomBytes, scrypt as _scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function hashPassword(value: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(value, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function comparePassword(value: string, hash: string): Promise<boolean> {
  const [salt, storedKey] = hash.split(':');
  const derivedKey = (await scrypt(value, salt, 64)) as Buffer;
  const storedKeyBuffer = Buffer.from(storedKey, 'hex');
  return timingSafeEqual(derivedKey, storedKeyBuffer);
}