import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { add } from 'date-fns'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersRepository } from 'src/users/users.repository'
import { AuthRepository } from './auth.repository'
import { User } from 'src/users/entities/user.entity'
import { hashPassword, comparePassword } from 'src/common/utils/password.util'
import { hashRefreshToken, compareRefreshToken } from 'src/common/utils/jwt.util'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async register({ password, ...data }) {
    const existing = await this.usersRepository.findUserByEmail(data.email)
    if (existing)
      throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    const hashedPassword = await hashPassword(password)
    const created = await this.usersRepository.createUser({
      ...data,
      passwordHash: hashedPassword,
      lastLogin: new Date(),
    })
    const tokens = await this.generateTokens(created.id, created.role)
    return { user: plainToInstance(User, created), tokens }
  }
  
  async login(data) {
    const user = await this.usersRepository.findUserByEmail(data.email)
    if (!user || user.isDeleted)
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials')
    if (user.isBanned)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Account banned')
    const isValid = await comparePassword(data.password, user.passwordHash)
    if (!isValid)
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials')
    const lastLogin = new Date()
    await this.usersRepository.updateUser(user.id, { lastLogin })
    const tokens = await this.generateTokens(user.id, user.role)
    return { user: plainToInstance(User, { ...user, lastLogin }), tokens }
  }

  async refreshToken(refreshToken) {
    const payload = await this.verifyRefreshToken(refreshToken)
    if (!payload)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid refresh token')
    const record = await this.findValidTokenRecord(payload.sub, refreshToken)
    if (!record)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Session terminated')
    await this.authRepository.revokeToken(record.id, {
      revoked: true,
      revokedAt: new Date(),
    })
    const user = await this.usersRepository.findUserById(payload.sub)
    if (!user || user.isDeleted)
      throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    if (user.isBanned)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Account banned')
    const tokens = await this.generateTokens(user.id, user.role)
    return { tokens }
  }

  async logout(refreshToken) {
    const payload = await this.verifyRefreshToken(refreshToken)
    if (!payload)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid refresh token')
    const record = await this.findValidTokenRecord(payload.sub, refreshToken)
    if (!record)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Already logged out or invalid session')
    await this.authRepository.revokeToken(record.id, {
      revoked: true,
      revokedAt: new Date(),
    })
  }

  async logoutAll(refreshToken) {
    const payload = await this.verifyRefreshToken(refreshToken)
    if (!payload)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid refresh token')
    const record = await this.findValidTokenRecord(payload.sub, refreshToken)
    if (!record)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid session')
    await this.authRepository.revokeAllTokensForUser(payload.sub, {
      revoked: true,
      revokedAt: new Date(),
    })
  }

  private async generateTokens(userId: number, role: string) {
    const payload = { sub: userId, role }
    const { accessSecret, refreshSecret, accessExpiresIn, refreshExpiresIn } =
      this.configService.get('jwt')
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn,
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    })
    const hashedToken = await hashRefreshToken(refreshToken)
    const expiresAt = add(new Date(), { days: Number(refreshExpiresIn) })
    await this.authRepository.createRefreshToken({
      userId: payload.sub,
      token: hashedToken,
      expiresAt,
    })
    return { accessToken, refreshToken }
  }

  private async verifyRefreshToken(refreshToken) {
    try {
      const { refreshSecret } = this.configService.get('jwt')
      return await this.jwtService.verifyAsync(refreshToken, { secret: refreshSecret })
    } catch {
      return null
    }
  }

  private async findValidTokenRecord(userId: number, refreshToken) {
    const tokenRecords = await this.authRepository.findActiveTokensByUserId(userId)
    for (const record of tokenRecords) {
      if (await compareRefreshToken(refreshToken, record.token)) return record
    }
    return null
  }
}