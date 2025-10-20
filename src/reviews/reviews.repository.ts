import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere } from 'typeorm'
import { Review } from './entities/review.entity'
import { FindReviewsDto } from './dto/find-reviews.dto'
import { paginate } from 'src/common/utils/pagination.util'

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repository: Repository<Review>,
  ) {}

  async createReview(userId: number, productId: number, rating: number, comment: string) {
    const review = this.repository.create({ userId, productId, rating, comment })
    return await this.repository.save(review)
  }

  async findProductReviews(query: FindReviewsDto) {
    const where: FindOptionsWhere<Review> = {}
    if (query.rating) where.rating = query.rating
    if ('isVisible' in query) where.isVisible = query.isVisible
    const result = await paginate(this.repository, query, { where })
    return { reviews: result.items, meta: result.meta }
  }

  async findOneReviewForAdmin(productId: number) {
    return await this.repository.findOne({ where: { productId } })
  }

  async findOneReview(userId: number, productId: number) {
    return await this.repository.findOne({
      where: { userId, productId, isVisible: true },
    })
  }

  async updateReview(reviewId: number, data: Partial<Review>) {
    return await this.repository.update({ id: reviewId }, data)
  }
}
