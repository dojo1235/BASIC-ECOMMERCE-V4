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

  createRefreshToken(data: { userId: number; token: string; expiresAt: Date }) {
    return await this.repository.save(this.repository.create(data))
  }

  findActiveTokensByUserId(userId) {
    return await this.repository.find({ where: { userId, revoked: false } })
  }

  revokeToken(refreshTokenId, data) {
    return await this.repository.update({ id: refreshTokenId, revoked: false }, data)
  }

  revokeAllTokensForUser(userId, data) {
    return await this.repository.update({ userId, revoked: false }, data)
  }

  deleteTokensByUserId(userId) {
    return await this.repository.delete({ userId })
  }
}
