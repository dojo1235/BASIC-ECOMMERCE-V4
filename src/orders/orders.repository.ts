import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere } from 'typeorm'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { FindOrdersDto } from './dto/find-orders.dto'
import { paginate } from 'src/common/utils/pagination.util'

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async findAllOrders(query: FindOrdersDto) {
    const where: FindOptionsWhere<Order> = {}
    if (query.status) where.status = query.status
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const relations = ['orderItems', 'orderItems.product']
    const result = await paginate(this.orderRepository, query, { where, relations })
    return { orders: result.items, meta: result.meta }
  }

  async findAllUserOrders(userId: number, query: FindOrdersDto) {
    const where: FindOptionsWhere<Order> = { userId }
    if (query.status) where.status = query.status
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const relations = ['orderItems', 'orderItems.product']
    const result = await paginate(this.orderRepository, query, { where, relations })
    return { orders: result.items, meta: result.meta }
  }

  async findOrderById(orderId: number) {
    return await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    })
  }

  async createOrder(data: Partial<Order>) {
    return await this.orderRepository.save(this.orderRepository.create(data))
  }

  async createOrderItems(orderItems: Partial<OrderItem>[]) {
    return await this.orderItemRepository.insert(orderItems)
  }

  async updateOrder(orderId: number, data: Partial<Order>) {
    return await this.orderRepository.update({ id: orderId }, data)
  }
}
