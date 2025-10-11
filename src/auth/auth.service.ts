import { Injectable, HttpStatus } from '@nestjs/common'
import { db } from 'src/drizzle/db'
import { users, refreshTokens } from 'src/drizzle/schema'
import { eq, and } from 'drizzle-orm'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { hashPassword, comparePassword } from 'src/common/utils/password.util'
import { verifyRefreshToken, compareToken, generateTokens } from 'src/common/utils/jwt.util'
import { AppError } from 'src/common/errors/app-error'

@Injectable()
export class AuthService {
  // Register new user (both)
  async register(registerDto: RegisterDto) {
    registerDto.email = registerDto.email.trim().toLowerCase()
    const password = registerDto.password.trim()
    const existing = await db.query.users.findFirst({
      where: eq(users.email, registerDto.email),
    })
    if (existing) throw new AppError('Email already exists', HttpStatus.CONFLICT)
    const hashedPassword = await hashPassword(password)
    const [user] = await db.insert(users)
      .values({
        ...registerDto,
        password: hashedPassword,
        lastLogin: new Date(),
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      }) as any[]
    const tokens = await generateTokens({ id: user.id, role: user.role })
    return { user, tokens }
  }

  // Login existing user (both)
  async login(loginDto: LoginDto) {
    loginDto.email = loginDto.email.trim().toLowerCase()
    const user = await db.query.users.findFirst({
      where: and(eq(users.email, loginDto.email), eq(users.isDeleted, false)),
    })
    if (!user) throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED)
    if (user.isBanned) throw new AppError('Account banned', HttpStatus.UNAUTHORIZED)
    const isValid = await comparePassword(loginDto.password, user.password)
    if (!isValid) throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED)
    const [updated] = await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      }) as any[]
    const tokens = await generateTokens({ id: user.id, role: user.role })
    return { user: updated, tokens }
  }

  // Refresh & rotate token (both)
  async refreshToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED)
    const tokenRecords = await db.query.refreshTokens.findMany({
      where: and(eq(refreshTokens.userId, decoded.id), eq(refreshTokens.revoked, false)),
    })
    let validTokenRecord: any = null
    for (const record of tokenRecords) {
      if (await compareToken(refreshToken, record.token)) {
        validTokenRecord = record
        break
      }
    }
    if (!validTokenRecord) throw new AppError('Session terminated', HttpStatus.UNAUTHORIZED)
    await db.update(refreshTokens)
      .set({ revoked: true, revokedAt: new Date() })
      .where(eq(refreshTokens.id, validTokenRecord.id))
    const user = await db.query.users.findFirst({
      where: and(eq(users.id, decoded.id), eq(users.isDeleted, false)),
    })
    if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND)
    if (user.isBanned) throw new AppError('Account banned', HttpStatus.UNAUTHORIZED)
    const tokens = await generateTokens({ id: user.id, role: user.role })
    return { tokens }
  }

  // Logout (both)
  async logout(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED)
    const tokenRecords = await db.query.refreshTokens.findMany({
      where: and(eq(refreshTokens.userId, decoded.id), eq(refreshTokens.revoked, false)),
    })
    let validTokenRecord: any = null
    for (const record of tokenRecords) {
      if (await compareToken(refreshToken, record.token)) {
        validTokenRecord = record
        break
      }
    }
    if (!validTokenRecord)
      throw new AppError('Already logged out or invalid session', HttpStatus.UNAUTHORIZED)
    await db.update(refreshTokens)
      .set({ revoked: true, revokedAt: new Date() })
      .where(eq(refreshTokens.id, validTokenRecord.id))
  }

  // Logout from all devices (both)
  async logoutAll(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED)
    const tokenRecords = await db.query.refreshTokens.findMany({
      where: and(eq(refreshTokens.userId, decoded.id), eq(refreshTokens.revoked, false)),
    })
    let validTokenRecord: any = null
    for (const record of tokenRecords) {
      if (await compareToken(refreshToken, record.token)) {
        validTokenRecord = record
        break
      }
    }
    if (!validTokenRecord)
      throw new AppError('Invalid session', HttpStatus.UNAUTHORIZED)
    await db.update(refreshTokens)
      .set({ revoked: true, revokedAt: new Date() })
      .where(and(eq(refreshTokens.userId, decoded.id), eq(refreshTokens.revoked, false)))
  }
}