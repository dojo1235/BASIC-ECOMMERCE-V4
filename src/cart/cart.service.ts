import { Injectable } from '@nestjs/common'
import { CartRepository } from './cart.repository'
import { ProductsRepository } from 'src/products/products.repository'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'
import { Cart } from './entities/cart.entity'

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // Add product to cart (user)
  async addToCart(userId: number, productId: number, quantity: number) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.isDeleted) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    if (quantity > product.stock) throw new AppError(ErrorCode.INVALID_STATE, 'Insufficient stock')

    const existing = await this.cartRepository.findCartItem(userId, productId)
    if (existing) {
      const newQuantity = existing.quantity + quantity
      if (newQuantity > product.stock)
        throw new AppError(ErrorCode.INVALID_STATE, 'Max stock reached')
      await this.cartRepository.updateCartItem(existing.id, newQuantity)
    } else {
      await this.cartRepository.addToCart(userId, productId, quantity)
    }

    const cartItem = await this.cartRepository.findCartItem(userId, productId)
    return { cartItem }
  }

  // Find user cart (user)
  async findUserCart(userId: number) {
    const cart = await this.cartRepository.findCart(userId)
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price ?? 0),
      0,
    )
    return { cart, count: totalQuantity, total: totalPrice.toFixed(2) }
  }

  // Count total items in cart (user)
  async countUserCartItems(userId: number) {
    const count = await this.cartRepository.countCartItems(userId)
    const cart = await this.cartRepository.findCart(userId)
    const total = cart.reduce((sum, item) => sum + item.quantity * (item.product?.price ?? 0), 0)
    return { count, total: total.toFixed(2) }
  }

  // Update quantity of an existing cart item (user)
  async updateQuantity(userId: number, productId: number, quantity: number) {
    const existing = await this.cartRepository.findCartItem(userId, productId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Cart item not found')

    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.isDeleted) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    if (quantity > product.stock) throw new AppError(ErrorCode.INVALID_STATE, 'Insufficient stock')

    await this.cartRepository.updateCartItem(existing.id, quantity)
    const updated = await this.cartRepository.findCartItem(userId, productId)
    return { cartItem: updated }
  }

  // Remove a single product from cart (user)
  async removeFromCart(userId: number, productId: number) {
    const existing = await this.cartRepository.findCartItem(userId, productId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Cart item not found')
    await this.cartRepository.removeFromCart(userId, productId)
    return { cartItem: existing }
  }

  // Clear all items in cart (user)
  async clearCart(userId: number) {
    const cart = await this.cartRepository.findCart(userId)
    if (!cart.length) throw new AppError(ErrorCode.NOT_FOUND, 'Cart is already empty')
    await this.cartRepository.clearCart(userId)
  }
}
