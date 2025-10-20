import { Injectable } from '@nestjs/common'
import { ReviewsRepository } from './reviews.repository'
import { ProductsRepository } from '../products/products.repository'
import { FindReviewsDto } from './dto/find-reviews.dto'
import { Review } from './entities/review.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // Create a review (user)
  async createReview(userId: number, productId: number, rating: number, comment: string) {
    const product = await this.productsRepository.findProductById(productId)
    if (!product || product.isDeleted) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found')
    const existing = await this.reviewsRepository.findOneReview(userId, productId)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Review already exist')
    const created = await this.reviewsRepository.createReview(userId, productId, rating, comment)
    return { review: created }
  }

  // Find all product reviews (admin)
  async findProductReviewsForAdmin(productId: number, query: FindReviewsDto) {
    return await this.reviewsRepository.findProductReviews(productId, query)
  }

  // Find all product reviews (user)
  async findProductReviews(productId: number, query: FindReviewsDto) {
    query.isVisible = true
    return await this.reviewsRepository.findProductReviews(productId, query)
  }

  // Find a single review (admin)
  async findOneForAdmin(reviewId: number) {
    const review = await this.reviewsRepository.findOneReviewForAdmin(reviewId)
    if (!review) throw new AppError(ErrorCode.NOT_FOUND, 'Review not found')
    return { review }
  }

  // Find single user review (user)
  async findUserReview(productId: number, userId: number) {
    const review = await this.reviewsRepository.findOneReview(userId, productId)
    if (!review) throw new AppError(ErrorCode.NOT_FOUND, 'Review not found')
    return { review }
  }

  // Update a review (admin)
  async updateReviewForAdmin(reviewId: number, data: Partial<Review>) {
    const existing = await this.reviewsRepository.findOneReviewForAdmin(reviewId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Review not found')
    await this.reviewsRepository.updateReview(reviewId, data)
    const updated = await this.reviewsRepository.findOneReviewForAdmin(reviewId)
    return { review: updated }
  }

  // Update user review (user)
  async updateReview(userId: number, productId: number, rating: number, comment: string) {
    const existing = await this.reviewsRepository.findOneReview(userId, productId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Review not found')
    await this.reviewsRepository.updateReview(existing.id, {
      rating,
      comment,
      updatedAt: new Date(),
    })
    const updated = await this.reviewsRepository.findOneReview(userId, productId)
    return { review: updated }
  }
}
