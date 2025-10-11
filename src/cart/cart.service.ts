import { Injectable, HttpStatus } from '@nestjs/common'
import { db } from 'src/drizzle/db'
import { cart, products } from 'src/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'
import { AppError } from 'src/common/errors/app-error'

@Injectable()
export class CartService {
  // Add product to cart (user)
  async addToCart(userId: number, productId: number, quantity: number) {
    const product = await db.query.products.findFirst({
      where: and(eq(products.id, productId), eq(products.isDeleted, false)),
    })
    if (!product) throw new AppError('Product not found', HttpStatus.NOT_FOUND)
    if (quantity < 1)
      throw new AppError('Quantity must be at least 1', HttpStatus.BAD_REQUEST)
    if (quantity > product.stock)
      throw new AppError('Insufficient Stock', HttpStatus.BAD_REQUEST)
    const existing = await db.query.cart.findFirst({
      where: and(eq(cart.userId, userId), eq(cart.productId, productId)),
    })
    if (existing) {
      const newQuantity = existing.quantity + quantity
      if (newQuantity > product.stock)
        throw new AppError('Max stock reached', HttpStatus.BAD_REQUEST)
      const [updated] = await db.update(cart)
        .set({ quantity: newQuantity, updatedAt: new Date() })
        .where(eq(cart.id, existing.id))
        .returning({
          id: cart.id,
          userId: cart.userId,
          productId: cart.productId,
          quantity: cart.quantity,
        }) as any[]
      return { cartItem: updated }
    }
    const [created] = await db.insert(cart)
      .values({ userId, productId, quantity })
      .returning({
        id: cart.id,
        userId: cart.userId,
        productId: cart.productId,
        quantity: cart.quantity,
      }) as any[]
    return { cartItem: created }
  }
  
  // Find user cart (user)
  async findUserCart(userId: number) {
    const items = await db.query.cart.findMany({
      where: eq(cart.userId, userId),
      orderBy: [desc(cart.createdAt)],
      columns: { id: true, userId: true, productId: true, quantity: true },
      with: {
        product: {
          columns: { id: true, name: true, image: true, price: true, stock: true },
        },
      },
    }) as any
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price ?? 0), 0
    )
    const total = Number(totalPrice.toFixed(2))
    return { cart: items, count: totalQuantity, total }
  }

  // Count total items in cart (user)
  async countUserCartItems(userId: number) {
    const items = await db.query.cart.findMany({
      where: eq(cart.userId, userId),
      with: {
        product: { columns: { price: true } },
      },
    }) as any
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price ?? 0), 0
    )
    const total = Number(totalPrice.toFixed(2))
    return { count: totalQuantity, total }
  }

  // Update quantity of an existing cart item (user)
  async updateQuantity(userId: number, productId: number, quantity: number) {
    const existing = await db.query.cart.findFirst({
      where: and(eq(cart.userId, userId), eq(cart.productId, productId)),
      with: { product: { columns: { stock: true } } },
    }) as any
    const product = existing?.product
    if (!existing || !product)
      throw new AppError('Cart item or product not found', HttpStatus.NOT_FOUND)
    if (quantity > product.stock)
      throw new AppError('Not enough stock', HttpStatus.BAD_REQUEST)
    if (quantity < 1)
      throw new AppError('Quantity must be at least 1', HttpStatus.BAD_REQUEST)
    const [updated] = await db.update(cart)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cart.id, existing.id))
      .returning({
        id: cart.id,
        userId: cart.userId,
        productId: cart.productId,
        quantity: cart.quantity,
      }) as any[]
    return { cartItem: updated }
  }

  // Remove a single product from cart (user)
  async removeFromCart(userId: number, productId: number) {
    const [deleted] = await db.delete(cart)
      .where(and(eq(cart.userId, userId), eq(cart.productId, productId)))
      .returning({
        id: cart.id,
        userId: cart.userId,
        productId: cart.productId,
        quantity: cart.quantity,
      }) as any[]
    if (!deleted)
      throw new AppError('Cart item not found', HttpStatus.NOT_FOUND)
    return { cartItem: deleted }
  }

  // Clear all items in cart (user)
  async clearCart(userId: number) {
    const deleted = await db.delete(cart)
      .where(eq(cart.userId, userId))
      .returning({
        id: cart.id,
        userId: cart.userId,
        productId: cart.productId,
        quantity: cart.quantity,
      }) as any[]
    if (!deleted.length)
      throw new AppError('Cart is already empty', HttpStatus.NOT_FOUND)
    return { cart: deleted }
  }
}