import { Injectable } from '@nestjs/common'
import {
  Repository,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOptionsWhere,
} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Seller } from './entities/seller.entity'
import { paginate } from 'src/common/utils/pagination.util'
import { FindSellersDto } from './dto/find-sellers.dto'

@Injectable()
export class SellersRepository {
  constructor(
    @InjectRepository(Seller)
    private readonly repository: Repository<Seller>,
  ) {}

  async createSeller(data: Partial<Seller>) {
    const entity = this.repository.create(data)
    return await this.repository.save(entity)
  }

  async findAllSellers(query: FindSellersDto) {
    const where: FindOptionsWhere<Seller> = {}
    if (query.search) where.storeName = ILike(`%${query.search}%`)
    if (query.premiumTier) where.premiumTier = query.premiumTier
    if (query.storeCountryId) where.storeCountryId = query.storeCountryId
    if (query.minBalance && query.maxBalance) {
      where.balance = Between(query.minBalance, query.maxBalance)
    } else if (query.minBalance) {
      where.balance = MoreThanOrEqual(query.minBalance)
    } else if (query.maxBalance) {
      where.balance = LessThanOrEqual(query.maxBalance)
    }
    if ('isVerified' in query) where.isVerified = query.isVerified
    if ('isSuspended' in query) where.isSuspended = query.isSuspended
    const result = await paginate(this.repository, query, { where })
    return { sellers: result.items, meta: result.meta }
  }

  async findSellerById(sellerId: number) {
    return await this.repository.findOne({ where: { id: sellerId } })
  }

  async findSellerByUserId(userId: number) {
    return await this.repository.findOne({ where: { userId } })
  }

  async updateSeller(sellerId: number, data: Partial<Seller>) {
    return await this.repository.update({ id: sellerId }, data)
  }
}
