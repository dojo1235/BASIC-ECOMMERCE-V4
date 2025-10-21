import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere } from 'typeorm'
import { Wishlist } from './entities/wishlist.entity'
import { paginate } from 'src/common/utils/pagination.util'
import { FindWishlistDto } from './dto/find-wishlist.dto'

@Injectable()
export class WishlistRepository {
  constructor(
    @InjectRepository(Wishlist)
    private readonly repository: Repository<Wishlist>,
  ) {}

  async createWishlistItem(userId: number, productId: number) {
    const entity = this.repository.create({ userId, productId })
    return await this.repository.save(entity)
  }

  async findWishlist(userId: number, query: FindWishlistDto) {
    const where: FindOptionsWhere<Wishlist> = { userId }
    const relations = ['product']
    const result = await paginate(this.repository, query, { where, relations })
    return { wishlist: result.items, meta: result.meta }
  }

  async countWishlistItems(userId: number) {
    return await this.repository.count({ where: { userId } })
  }

  async findWishlistItem(userId: number, productId: number) {
    return await this.repository.findOne({ where: { userId, productId } })
  }

  async removeFromWishlist(wishlistId: number) {
    return await this.repository.delete({ id: wishlistId })
  }
}
