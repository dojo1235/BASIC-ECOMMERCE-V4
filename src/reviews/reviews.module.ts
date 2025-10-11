import { Module } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { AdminsReviewsController } from './admins-reviews.controller'
import { ReviewsController } from './reviews.controller'

@Module({
  controllers: [
    AdminsReviewsController,
    ReviewsController,
  ],
  providers: [ReviewsService],
})
export class ReviewsModule {}
