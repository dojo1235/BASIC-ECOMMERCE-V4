import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository, EntityManager } from 'typeorm'
import { Cart } from './entities/cart.entity'

@Injectable()
export class CartRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Cart)
    private readonly repository: Repository<Cart>,
  ) {}

  async addToCart(userId: number, productId: number, quantity: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    const cartItem = repo.create({ userId, productId, quantity })
    await repo.save(cartItem)
  }

  async findCart(userId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: ['product'],
    })
  }

  async findCartItem(userId: number, productId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.findOne({ where: { userId, productId } })
  }

  async countCartItems(userId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    const { sum } = await repo
      .createQueryBuilder('cart')
      .select('SUM(cart.quantity)', 'sum')
      .where('cart.userId = :userId', { userId })
      .getRawOne()
    return Number(sum) || 0
  }

  async updateCartItem(cartItemId: number, quantity: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    await repo.update({ id: cartItemId }, { quantity })
  }

  async removeFromCart(userId: number, productId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    await repo.delete({ userId, productId })
  }

  async clearCart(userId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    await repo.delete({ userId })
  }

  async transaction<T>(work: (manager: EntityManager) => Promise<T>) {
    return await this.dataSource.transaction(work)
  }

  private repo(manager?: EntityManager) {
    return manager ? manager.getRepository(Cart) : this.repository
  }
}
