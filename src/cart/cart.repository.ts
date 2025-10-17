import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cart } from './entities/cart.entity'

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>
  ) {}

  async addToCart(userId, productId, quantity) {
    const cartItem = this.repository.create({ userId, productId, quantity })
    await this.repository.save(cartItem)
  }
  
  async findCart(userId) {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['product'],
    })
  }

  async findCartItem(userId, productId) {
    return this.repository.findOne({ where: { userId, productId } })
  }

  async countCartItems(userId) {
    const items = await this.repository.find({ where: { userId } })
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  async updateCartItem(cartItemId, quantity) {
    return this.repository.update({ id: cartItemId }, { quantity })
  }

  async removeFromCart(userId, productId) {
    return this.repository.delete({ userId, productId })
  }

  async clearCart(userId) {
    return this.repository.delete({ userId })
  }
}