import { Injectable } from '@nestjs/common'
import { Transactional } from 'typeorm-transactional'
import { OrdersRepository } from './orders.repository'
import { ProductsRepository } from 'src/products/products.repository'
import { CartRepository } from 'src/cart/cart.repository'
import { FindOrdersDto } from './dto/find-orders.dto'
import { OrderStatus } from './entities/order.entity'
import { Cart } from 'src/cart/entities/cart.entity'
import { Product } from 'src/products/entities/product.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  // Place order (user)
  @Transactional()
  async placeOrder(userId: number, data: { contact: string; shippingAddress: string }) {
    const userCart = await this.cartRepository.findCart(userId)
    if (!userCart.length) throw new AppError(ErrorCode.INVALID_STATE, 'Cart is empty')
    const { total, shippingFee } = this.getTotal(userCart)
    const createdOrder = await this.ordersRepository.createOrder({
      userId,
      total,
      contact: data.contact,
      shippingAddress: data.shippingAddress,
      shippingFee,
    })
    await this.ordersRepository.createOrderItems(
      userCart.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.product.price),
      })),
    )
    for (const item of userCart) {
      const product = item.product as Partial<Product>
      await this.productsRepository.updateProduct(item.productId, {
        stock: (product.stock ?? 0) - item.quantity,
      })
    }
    await this.cartRepository.clearCart(userId)
    const order = await this.ordersRepository.findOrderById(createdOrder.id)
    return { order }
  }

  // Find all orders (admin)
  async findAllOrders(query: FindOrdersDto) {
    return await this.ordersRepository.findAllOrders(query)
  }

  // Find all user orders (admin)
  async findUserOrdersForAdmin(userId: number, query: FindOrdersDto) {
    return await this.ordersRepository.findAllUserOrders(userId, query)
  }

  // Find all user orders (user)
  async findUserOrders(userId: number, query: FindOrdersDto) {
    query.isDeleted = false
    return await this.ordersRepository.findAllUserOrders(userId, query)
  }

  // Find single order (admin)
  async findOneForAdmin(orderId: number) {
    const order = await this.ordersRepository.findOrderById(orderId)
    if (!order) throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')
    return { order }
  }

  // Find single order (user)
  async findOne(userId: number, orderId: number) {
    const order = await this.ordersRepository.findOrderById(orderId)
    if (!order || order.userId !== userId || order.isDeleted)
      throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')
    return { order }
  }

  // Update order (admin)
  async updateOrder(orderId: number, data: Record<string, any>) {
    const existing = await this.ordersRepository.findOrderById(orderId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')
    if (data.status && existing.status === 'cancelled')
      throw new AppError(ErrorCode.INVALID_STATE, 'Updating cancelled order not allowed')
    if (data.status === 'cancelled')
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Orders can only be cancelled by owners')
    await this.ordersRepository.updateOrder(orderId, data)
    const updated = await this.ordersRepository.findOrderById(orderId)
    return { order: updated }
  }

  // Cancel order (user)
  @Transactional()
  async cancelOrder(userId: number, orderId: number) {
    const order = await this.ordersRepository.findOrderById(orderId)
    if (!order || order.userId !== userId || order.isDeleted)
      throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')
    if (order.status === OrderStatus.Cancelled)
      throw new AppError(ErrorCode.INVALID_STATE, 'Order already cancelled')
    if (![OrderStatus.Pending, OrderStatus.Processing].includes(order.status))
      throw new AppError(ErrorCode.INVALID_STATE, 'Order cannot be cancelled')
    for (const item of order.orderItems) {
      const product = await this.productsRepository.findProductById(item.productId)
      if (!product) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
      await this.productsRepository.updateProduct(item.productId, {
        stock: product.stock + item.quantity,
      })
    }
    await this.ordersRepository.updateOrder(orderId, {
      status: OrderStatus.Cancelled,
    })
    const updated = await this.ordersRepository.findOrderById(orderId)
    return { order: updated }
  }

  // Helper to calculate total and shipping fee
  private getTotal(userCart: Cart[]): { total: number; shippingFee: number } {
    let total = 0
    for (const item of userCart) {
      const product = item.product as Partial<Product>
      if (!product || product.isDeleted)
        throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
      const stock = product.stock ?? 0
      const price = Number(product.price ?? 0)
      if (item.quantity > stock)
        throw new AppError(
          ErrorCode.INVALID_STATE,
          `Insufficient stock for ${product.name ?? 'product'}`,
        )
      total += price * item.quantity
    }
    const shippingFee = total > 200 ? 0 : 50
    total = Number((total + shippingFee).toFixed(2))
    return { total, shippingFee }
  }
}
