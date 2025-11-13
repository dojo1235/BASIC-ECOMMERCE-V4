import { Injectable } from '@nestjs/common'
import { add } from 'date-fns'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersRepository } from 'src/users/users.repository'
import { AuthRepository } from './auth.repository'
import { hash, compare } from 'src/common/utils/crypto.util'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

interface JwtPayload {
  sub: number
  role: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async register({ password, ...data }: RegisterDto) {
    const existing = await this.usersRepository.findUserByEmail(data.email)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    const passwordHash = await hash(password)
    const created = await this.usersRepository.createUser({
      ...data,
      passwordHash,
      lastLogin: new Date(),
    })
    const tokens = await this.generateTokens(created.id, created.role)
    return { user: created, tokens }
  }

  async login(data: LoginDto) {
    if (!data.email) throw new AppError(ErrorCode.VALIDATION_ERROR, 'Email is required')
    if (!data.password) throw new AppError(ErrorCode.VALIDATION_ERROR, 'Password is required')
    const user = await this.usersRepository.findUserByEmail(data.email)
    if (!user || user.isDeleted)
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials')
    if (user.isBanned) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Account banned')
    const isValid = await compare(data.password, user.passwordHash)
    if (!isValid) throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Invalid credentials')
    const lastLogin = new Date()
    await this.usersRepository.updateUser(user.id, { lastLogin })
    const updated = await this.usersRepository.findUserByEmail(data.email)
    const tokens = await this.generateTokens(user.id, user.role)
    return { user: updated, tokens }
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken)
    if (!payload) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid refresh token')
    const record = await this.findValidTokenRecord(payload.sub, refreshToken)
    if (!record) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Session terminated')
    await this.authRepository.revokeToken(record.id, {
      revoked: true,
      revokedAt: new Date(),
    })
    const user = await this.usersRepository.findUserById(payload.sub)
    if (!user || user.isDeleted) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    if (user.isBanned) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Account banned')
    const tokens = await this.generateTokens(user.id, user.role)
    return { tokens }
  }

  async logout(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken)
    if (!payload) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid refresh token')
    const record = await this.findValidTokenRecord(payload.sub, refreshToken)
    if (!record)
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Already logged out or invalid session')
    await this.authRepository.revokeToken(record.id, {
      revoked: true,
      revokedAt: new Date(),
    })
  }

  async logoutAll(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken)
    if (!payload) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid refresh token')
    const record = await this.findValidTokenRecord(payload.sub, refreshToken)
    if (!record) throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Invalid session')
    await this.authRepository.revokeAllTokensForUser(payload.sub, {
      revoked: true,
      revokedAt: new Date(),
    })
  }

  private async generateTokens(userId: number, role: string) {
    const payload: JwtPayload = { sub: userId, role }
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
    const hashedToken = await hash(refreshToken)
    const expiresAt = add(new Date(), { days: parseInt(refreshExpiresIn, 10) })
    await this.authRepository.createRefreshToken({
      userId: payload.sub,
      token: hashedToken,
      expiresAt,
    })
    return { accessToken, refreshToken }
  }

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload | null> {
    try {
      const { refreshSecret } = this.configService.get('jwt')
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, { secret: refreshSecret })
    } catch {
      return null
    }
  }

  private async findValidTokenRecord(userId: number, refreshToken: string) {
    const tokenRecords = await this.authRepository.findActiveTokensByUserId(userId)
    for (const record of tokenRecords) {
      if (await compare(refreshToken, record.token)) return record
    }
    return null
  }
}
