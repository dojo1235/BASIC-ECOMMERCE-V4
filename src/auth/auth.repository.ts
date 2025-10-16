import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RefreshToken } from './entities/refresh-token.entity'

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>
  ) {}
  
  createRefreshToken(data) {
    return this.repository.save(this.repository.create(data))
  }
  
  findActiveTokensByUserId(userId) {
    return this.repository.find({ where: { userId, revoked: false } })
  }

  revokeToken(refreshTokenId, data) {
    return this.repository.update({ id: refreshTokenId, revoked: false }, data)
  }
  
  revokeAllTokensForUser(userId, data) {
    return this.repository.update({ userId, revoked: false }, data)
  }

  deleteTokensByUserId(userId) {
    return this.repository.delete({ userId })
  }
}