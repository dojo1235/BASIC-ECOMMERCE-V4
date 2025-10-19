import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RefreshToken } from './entities/refresh-token.entity'

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(data: { userId: number; token: string; expiresAt: Date }) {
    return await this.repository.save(this.repository.create(data))
  }

  async findActiveTokensByUserId(userId: number) {
    return await this.repository.find({ where: { userId, revoked: false } })
  }

  async revokeToken(refreshTokenId: number, data: Partial<RefreshToken>) {
    return await this.repository.update({ id: refreshTokenId, revoked: false }, data)
  }

  async revokeAllTokensForUser(userId: number, data: Partial<RefreshToken>) {
    return await this.repository.update({ userId, revoked: false }, data)
  }

  async deleteTokensByUserId(userId: number) {
    return await this.repository.delete({ userId })
  }
}
