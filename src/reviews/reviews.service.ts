import { Injectable, HttpStatus } from '@nestjs/common'
import { db } from 'src/drizzle/db'
import { reviews, products } from 'src/drizzle/schema'
import { eq, and, desc } from 'drizzle-orm'
import { paginate } from 'src/common/utils/pagination.util'
import { AppError } from 'src/common/errors/app-error'

@Injectable()
export class ReviewsService {
  // Create a review (user)
  async createReview(userId: number, productId: number, rating: number, comment: string) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })
    if (!product) throw new AppError('Product not found', HttpStatus.NOT_FOUND)
    const existing = await db.query.reviews.findFirst({
      where: and(eq(reviews.productId, productId), eq(reviews.userId, userId)),
    })
    if (existing) throw new AppError('Review already exists', HttpStatus.CONFLICT)
    const [created] = (await db
      .insert(reviews)
      .values({ userId, productId, rating, comment })
      .returning({
        id: reviews.id,
        userId: reviews.userId,
        productId: reviews.productId,
        rating: reviews.rating,
        comment: reviews.comment,
      })) as any[]
    return { review: created }
  }

  // Find all product reviews (admin)
  async findProductReviewsForAdmin(productId: number, query: Record<string, any>) {
    const whereConditions: any[] = [eq(reviews.productId, productId)]
    if (query.rating) whereConditions.push(eq(reviews.rating, Number(query.rating)))
    if ('isVisible' in query)
      whereConditions.push(eq(reviews.isVisible, query.isVisible === 'true'))
    const result = await paginate(db.query.reviews, reviews, whereConditions, query)
    return { reviews: result.items, meta: result.meta }
  }

  // Find all product reviews (user)
  async findProductReviews(productId: number, query: Record<string, any>) {
    const whereConditions: any[] = [eq(reviews.productId, productId), eq(reviews.isVisible, true)]
    const result = await paginate(db.query.reviews, reviews, whereConditions, query)
    return { reviews: result.items, meta: result.meta }
  }

  // Find a single review (admin)
  async findOneForAdmin(reviewId: number) {
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    })
    if (!review) throw new AppError('Review not found', HttpStatus.NOT_FOUND)
    return { review }
  }

  // Find single user review (user)
  async findUserReview(productId: number, userId: number) {
    const review = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.userId, userId),
        eq(reviews.isVisible, true),
      ),
    })
    if (!review) throw new AppError('Review not found', HttpStatus.NOT_FOUND)
    return { review }
  }

  // Update a review (admin)
  async updateReviewForAdmin(reviewId: number, dto: any) {
    const existing = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    })
    if (!existing) throw new AppError('Review not found', HttpStatus.NOT_FOUND)
    const [updated] = (await db
      .update(reviews)
      .set(dto)
      .where(eq(reviews.id, reviewId))
      .returning()) as any[]
    return { review: updated }
  }

  // Update user review (user)
  async updateReview(userId: number, productId: number, rating: number, comment: string) {
    const existing = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.productId, productId),
        eq(reviews.userId, userId),
        eq(reviews.isVisible, true),
      ),
    })
    if (!existing) throw new AppError('Review not found', HttpStatus.NOT_FOUND)
    const [updated] = (await db
      .update(reviews)
      .set({
        rating,
        comment,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(reviews.productId, productId),
          eq(reviews.userId, userId),
          eq(reviews.isVisible, true),
        ),
      )
      .returning({
        id: reviews.id,
        userId: reviews.userId,
        productId: reviews.productId,
        rating: reviews.rating,
        comment: reviews.comment,
      })) as any[]
    return { review: updated }
  }
}
