import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { add } from 'date-fns'
import { timingSafeEqual, randomBytes, scrypt as _scrypt } from 'crypto'
import { promisify } from 'util'
import { db } from 'src/drizzle/db'
import { refreshTokens } from 'src/drizzle/schema'

const scrypt = promisify(_scrypt)

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
if (!ACCESS_TOKEN_SECRET)
  throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables')

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
if (!REFRESH_TOKEN_SECRET)
  throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables')

// ===== Helper for hashing refresh tokens =====
export const hashToken = async (value: string): Promise<string> => {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(value, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

// ===== Helper for comparing refresh tokens =====
export const compareToken = async (value: string, hash: string): Promise<boolean> => {
  const [salt, storedKey] = hash.split(':')
  const derivedKey = (await scrypt(value, salt, 64)) as Buffer
  const storedKeyBuffer = Buffer.from(storedKey, 'hex')
  return timingSafeEqual(derivedKey, storedKeyBuffer)
}

// ===== Generate access + refresh tokens =====
export const generateTokens = async (payload: { id: number; role: string }) => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
  const refreshTokenRaw = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

  const hashedToken = await hashToken(refreshTokenRaw)
  const expiresAt = add(new Date(), { days: 7 })
  
  await db.insert(refreshTokens)
    .values({
      userId: payload.id,
      token: hashedToken,
      expiresAt
    })
  
  return { accessToken, refreshToken: refreshTokenRaw }
}

// ===== Verify Access Token (strict) =====
export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_TOKEN_SECRET) as any

// ===== Verify Refresh Token (ignore expiration) =====
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET, { ignoreExpiration: true }) as any
  } catch (err) {
    return null; // return null instead of throwing
  }
}