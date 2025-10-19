import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cart } from './entities/cart.entity'

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number) {
    const cartItem = this.repository.create({ userId, productId, quantity })
    await this.repository.save(cartItem)
  }

  async findCart(userId: number) {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['product'],
    })
  }

  async findCartItem(userId: number, productId: number) {
    return await this.repository.findOne({ where: { userId, productId } })
  }

  async countCartItems(userId: number) {
    const { sum } = await this.repository
      .createQueryBuilder('cart')
      .select('SUM(cart.quantity)', 'sum')
      .where('cart.userId = :userId', { userId })
      .getRawOne()
    return Number(sum) || 0
  }

  async updateCartItem(cartItemId: number, quantity: number) {
    await this.repository.update({ id: cartItemId }, { quantity })
  }

  async removeFromCart(userId: number, productId: number) {
    await this.repository.delete({ userId, productId })
  }

  async clearCart(userId: number) {
    await this.repository.delete({ userId })
  }
}
