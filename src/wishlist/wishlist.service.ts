import { Injectable } from '@nestjs/common'
import { WishlistRepository } from './wishlist.repository'
import { ProductsRepository } from 'src/products/products.repository'
import { FindWishlistDto } from './dto/find-wishlist.dto'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // Add product to wishlist (user)
  async addProductToWishlist(userId: number, productId: number) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.isDeleted) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    const existing = await this.wishlistRepository.findWishlistItem(userId, productId)
    if (existing) return
    await this.wishlistRepository.createWishlistItem(userId, productId)
  }

  // Get all wishlist items (user)
  async findWishlist(userId: number, query: FindWishlistDto) {
    return await this.wishlistRepository.findWishlist(userId, query)
  }

  // Count wishlist items (user)
  async countWishlistItems(userId: number) {
    const count = await this.wishlistRepository.countWishlistItems(userId)
    return { count }
  }

  // Remove product from wishlist (user)
  async removeProductFromWishlist(userId: number, productId: number) {
    const existing = await this.wishlistRepository.findWishlistItem(userId, productId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Item not found in wishlist')
    await this.wishlistRepository.removeFromWishlist(existing.id)
  }
}
