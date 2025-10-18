import { Injectable, HttpStatus } from '@nestjs/common'
import { db } from 'src/drizzle/db'
import { wishlist, products } from 'src/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'
import { paginate } from 'src/common/utils/pagination.util'
import { AppError } from 'src/common/errors/app-error'

@Injectable()
export class WishlistService {
  // Add product to wishlist (user)
  async addProductToWishlist(userId: number, productId: number) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })
    if (!product) throw new AppError('Product not found', HttpStatus.NOT_FOUND)
    const existing = await db.query.wishlist.findFirst({
      where: and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)),
    })
    if (existing) return
    await db.insert(wishlist).values({ userId, productId })
  }

  // Get all wishlist items (user)
  async findWishlist(userId: number, query: Record<string, any>) {
    const whereConditions: any[] = [eq(wishlist.userId, userId)]
    const extras = {
      columns: { createdAt: false },
      with: {
        product: {
          columns: { id: true, name: true, image: true, price: true },
        },
      },
    }
    const result = await paginate(db.query.wishlist, wishlist, whereConditions, query, extras)
    return { wishlist: result.items, meta: result.meta }
  }

  // Count wishlist items (user)
  async countWishlistItems(userId: number) {
    const result = await db.query.wishlist.findMany({
      where: eq(wishlist.userId, userId),
    })
    return { count: result.length }
  }

  // Remove product from wishlist (user)
  async removeProductFromWishlist(userId: number, productId: number) {
    const existing = await db.query.wishlist.findFirst({
      where: and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)),
    })
    if (!existing) throw new AppError('Item not found in wishlist', HttpStatus.NOT_FOUND)
    await db
      .delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))
  }
}
