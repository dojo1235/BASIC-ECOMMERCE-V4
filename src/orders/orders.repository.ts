import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository, EntityManager, FindOptionsWhere } from 'typeorm'
import { Order, OrderItem } from './entities/order.entity'
import { FindOrdersDto } from './dto/find-orders.dto'
import { paginate } from 'src/common/utils/pagination.util'

@Injectable()
export class OrdersRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async findAllOrders(query: FindOrdersDto, manager?: EntityManager) {
    const repo = this.repo(manager)
    const where: FindOptionsWhere<Order> = {}
    if (query.status) where.status = query.status
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const result = await paginate(repo, query, { where })
    return { orders: result.items, meta: result.meta }
  }

  async findAllUserOrders(userId: number, query: FindOrdersDto, manager?: EntityManager) {
    const repo = this.repo(manager)
    const where: FindOptionsWhere<Order> = { userId }
    if (query.status) where.status = query.status
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const result = await paginate(repo, query, { where })
    return { orders: result.items, meta: result.meta }
  }

  async findOrderByIdForAdmin(orderId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    })
  }

  async findOrderById(orderId: number, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.findOne({
      where: { id: orderId, isDeleted: false },
      relations: ['orderItems'],
    })
  }

  async createOrder(data: Partial<Order>, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.save(repo.create(data))
  }

  async createOrderItems(orderItems: Partial<OrderItem>[], manager?: EntityManager) {
    const repo = this.itemRepo(manager)
    return await repo.insert(orderItems)
  }

  async updateOrder(orderId: number, data: Partial<Order>, manager?: EntityManager) {
    const repo = this.repo(manager)
    return await repo.update({ id: orderId }, data)
  }

  async transaction<T>(work: (manager: EntityManager) => Promise<T>) {
    return await this.dataSource.transaction(work)
  }

  private repo(manager?: EntityManager) {
    return manager ? manager.getRepository(Order) : this.orderRepository
  }

  private itemRepo(manager?: EntityManager) {
    return manager ? manager.getRepository(OrderItem) : this.orderItemRepository
  }
}
