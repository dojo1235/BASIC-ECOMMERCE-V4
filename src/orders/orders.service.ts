import { Injectable } from '@nestjs/common'
import { OrdersRepository } from './orders.repository'
import { ProductsRepository } from 'src/products/products.repository'
import { CartRepository } from 'src/cart/cart.repository'
import { FindOrdersDto } from './dto/find-orders.dto'
import { OrderStatus } from './entities/order.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  // Place order (transactional)
  async placeOrder(userId: number, data: { contact: string; shippingAddress: string }) {
    const userCart = await this.cartRepository.findCart(userId)
    if (!userCart.length) throw new AppError(ErrorCode.INVALID_STATE, 'Cart is empty')
    let total = 0
    for (const item of userCart) {
      const product = item.product
      if (!product || product.isDeleted)
        throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
      if (item.quantity > product.stock)
        throw new AppError(ErrorCode.INVALID_STATE, `Insufficient stock for ${product.name}`)
      total += Number(product.price) * item.quantity
    }
    const shippingFee = total > 200 ? 0 : 50
    total = Number((total + shippingFee).toFixed(2))
    const order = await this.ordersRepository.transaction(async (manager) => {
      const created = await this.ordersRepository.createOrder(
        {
          userId,
          total,
          contact: data.contact,
          shippingAddress: data.shippingAddress,
          shippingFee,
        },
        manager,
      )
      await this.ordersRepository.createOrderItems(
        userCart.map((item) => ({
          orderId: created.id,
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.product.price),
        })),
        manager,
      )
      for (const item of userCart) {
        const product = item.product as any // would type with as Product later
        await this.productsRepository.updateProduct(
          item.productId,
          { stock: product.stock - item.quantity },
          manager,
        )
      }
      await this.cartRepository.clearCart(userId, manager)
      return await this.ordersRepository.findOrderById(created.id, manager)
    })
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
    const order = await this.ordersRepository.findOrderByIdForAdmin(orderId)
    if (!order) throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')
    return { order }
  }

  // Find single order (user)
  async findOne(userId: number, orderId: number) {
    const order = await this.ordersRepository.findOrderById(orderId)
    if (!order || order.userId !== userId)
      throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')
    return { order }
  }

  // Update order (admin)
  async updateOrder(orderId: number, data: Record<string, any>) {
    const existing = await this.ordersRepository.findOrderByIdForAdmin(orderId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')

    if (data.status && existing.status === 'cancelled')
      throw new AppError(ErrorCode.INVALID_STATE, 'Updating cancelled order not allowed')
    if (data.status === 'cancelled')
      throw new AppError(ErrorCode.NOT_ENOUGH_PERMISSIONS, 'Orders can only be cancelled by owners')
    await this.ordersRepository.updateOrder(orderId, data)
    const updated = await this.ordersRepository.findOrderByIdForAdmin(orderId)
    return { order: updated }
  }

  // Cancel order (user)
  async cancelOrder(userId: number, orderId: number) {
    return await this.ordersRepository.transaction(async (manager) => {
      const order = await this.ordersRepository.findOrderById(orderId, manager)
      if (!order || order.userId !== userId)
        throw new AppError(ErrorCode.NOT_FOUND, 'Order not found')
      if (order.status === OrderStatus.Cancelled)
        throw new AppError(ErrorCode.INVALID_STATE, 'Order already cancelled')
      if (![OrderStatus.Pending, OrderStatus.Processing].includes(order.status))
        throw new AppError(ErrorCode.INVALID_STATE, 'Order cannot be cancelled')
      for (const item of order.orderItems) {
        const product = await this.productsRepository.findProductById(item.productId)
        if (!product) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
        await this.productsRepository.updateProduct(
          item.productId,
          { stock: product.stock + item.quantity },
          manager,
        )
      }
      await this.ordersRepository.updateOrder(orderId, { status: OrderStatus.Cancelled }, manager)
      const updated = await this.ordersRepository.findOrderById(orderId, manager)
      return { order: updated }
    })
  }
}

/*import { Injectable } from '@nestjs/common'
import { db } from 'src/drizzle/db'
import { orders, orderItems, products, cart } from 'src/drizzle/schema'
import { eq, and, desc, SQL } from 'drizzle-orm'
import { paginate } from 'src/common/utils/pagination.util'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class OrdersService {
  // Place order (transactional)
  async placeOrder(userId: number, payload: { contact: string; shippingAddress: string }) {
    const userCart = await db.query.cart.findMany({
      where: eq(cart.userId, userId),
      with: { product: true },
    })
    if (!userCart.length) throw new AppError('Cart is empty', HttpStatus.BAD_REQUEST)
    let total = 0
    for (const item of userCart) {
      const product = item.product as any
      if (!product || product.isDeleted)
        throw new AppError('Product not found', HttpStatus.BAD_REQUEST)
      if (item.quantity > product.stock)
        throw new AppError(`Insufficient stock for ${product.name}`, HttpStatus.BAD_REQUEST)
      total += Number(product.price) * item.quantity
    }
    const shippingFee = total > 200 ? 0 : 50
    total = Number((total + shippingFee).toFixed(2))
    const order = await db.transaction(async (tx) => {
      const [created] = (await tx
        .insert(orders)
        .values({
          userId,
          total,
          contact: payload.contact,
          shippingAddress: payload.shippingAddress,
          shippingFee,
        })
        .returning()) as any[]
      await tx.insert(orderItems).values(
        userCart.map((item) => ({
          orderId: created.id,
          productId: item.productId,
          quantity: item.quantity,
          price: Number((item.product as any).price),
        })),
      )
      for (const item of userCart) {
        const product = item.product as any
        await tx
          .update(products)
          .set({ stock: product.stock - item.quantity })
          .where(eq(products.id, item.productId))
      }
      await tx.delete(cart).where(eq(cart.userId, userId))
      return await tx.query.orders.findFirst({
        where: eq(orders.id, created.id),
        columns: {
          id: true,
          userId: true,
          total: true,
          contact: true,
          shippingAddress: true,
          shippingFee: true,
          status: true,
        },
        with: {
          orderItems: {
            columns: { createdAt: false },
            with: {
              product: {
                columns: { id: true, name: true, image: true, price: true },
              },
            },
          },
        },
      })
    })
    return { order }
  }

  // Get all orders (admin)
  async findAllOrders(query: Record<string, any>) {
    const whereConditions: SQL[] = []
    const extras = {
      with: {
        orderItems: {
          columns: { createdAt: false },
          with: {
            product: {
              columns: { id: true, name: true, image: true, price: true },
            },
          },
        },
      },
    }
    if (query.status) whereConditions.push(eq(orders.status, query.status))
    if ('isDeleted' in query) whereConditions.push(eq(orders.isDeleted, query.isDeleted === 'true'))
    const result = await paginate(db.query.orders, orders, whereConditions, query, extras)
    return { orders: result.items, meta: result.meta }
  }

  // Find all user orders (admin)
  async findUserOrdersForAdmin(userId: number, query: Record<string, any>) {
    const whereConditions = [eq(orders.userId, userId)]
    const extras = {
      with: {
        orderItems: {
          columns: { createdAt: false },
          with: {
            product: {
              columns: { id: true, name: true, image: true, price: true },
            },
          },
        },
      },
    }
    if (query.status) whereConditions.push(eq(orders.status, query.status))
    if ('isDeleted' in query) whereConditions.push(eq(orders.isDeleted, query.isDeleted === 'true'))
    const result = await paginate(db.query.orders, orders, whereConditions, query, extras)
    return { orders: result.items, meta: result.meta }
  }

  // Find all user orders (user)
  async findUserOrders(userId: number, query: Record<string, any>) {
    const whereConditions = [eq(orders.userId, userId), eq(orders.isDeleted, false)]
    const extras = {
      columns: {
        id: true,
        userId: true,
        total: true,
        contact: true,
        shippingAddress: true,
        shippingFee: true,
        status: true,
      },
      with: {
        orderItems: {
          columns: { createdAt: false },
          with: {
            product: {
              columns: { id: true, name: true, image: true, price: true },
            },
          },
        },
      },
    }
    const result = await paginate(db.query.orders, orders, whereConditions, query, extras)
    return { orders: result.items, meta: result.meta }
  }

  // Find single order (admin)
  async findOneForAdmin(orderId: number) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        orderItems: {
          columns: { createdAt: false },
          with: {
            product: { columns: { id: true, name: true, image: true, price: true } },
          },
        },
      },
    })
    if (!order) throw new AppError('Order not found', HttpStatus.NOT_FOUND)
    return { order }
  }

  // Find single order (user)
  async findOne(userId: number, orderId: number) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId), eq(orders.isDeleted, false)),
      columns: {
        id: true,
        userId: true,
        total: true,
        contact: true,
        shippingAddress: true,
        shippingFee: true,
        status: true,
      },
      with: {
        orderItems: {
          columns: { createdAt: false },
          with: {
            product: { columns: { id: true, name: true, image: true, price: true } },
          },
        },
      },
    })
    if (!order) throw new AppError('Order not found', HttpStatus.NOT_FOUND)
    return { order }
  }

  // Update order (admin)
  async updateOrder(orderId: number, payload: Record<string, any>) {
    const existing = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    })
    if (!existing) throw new AppError('Order not found', HttpStatus.NOT_FOUND)
    if (payload.status && existing.status === 'cancelled')
      throw new AppError('updating cancelled order status not allowed', HttpStatus.BAD_REQUEST)
    if (payload.status && payload.status === 'cancelled')
      throw new AppError('Orders can only be cancelled by owners', HttpStatus.BAD_REQUEST)
    const [updated] = await db
      .update(orders)
      .set(payload as any)
      .where(eq(orders.id, orderId))
      .returning()
    return { order: updated }
  }

  // Cancel order (user)
  async cancelOrder(userId: number, orderId: number) {
    return db.transaction(async (tx) => {
      const order = await tx.query.orders.findFirst({
        where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
        with: { orderItems: true },
      })
      if (!order) throw new AppError('Order not found', HttpStatus.NOT_FOUND)
      if (!['pending', 'processing'].includes(order.status))
        throw new AppError('Order cannot be cancelled', HttpStatus.BAD_REQUEST)
      for (const item of order.orderItems) {
        const product = await tx.query.products.findFirst({
          where: eq(products.id, item.productId),
        })
        if (!product) throw new AppError('Product not found', HttpStatus.NOT_FOUND)
        await tx
          .update(products)
          .set({ stock: (product.stock ?? 0) + item.quantity })
          .where(eq(products.id, item.productId))
      }
      const [updated] = await tx
        .update(orders)
        .set({ status: 'cancelled' })
        .where(eq(orders.id, orderId))
        .returning()
      return { order: updated }
    })
  }
}*/
