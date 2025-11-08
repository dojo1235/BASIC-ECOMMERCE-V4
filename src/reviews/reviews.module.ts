import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from 'src/products/products.module'
import { ReviewsRepository } from './reviews.repository'
import { ReviewsService } from './reviews.service'
import { AdminsReviewsController } from './admins-reviews.controller'
import { ReviewsController } from './reviews.controller'
import { Review } from './entities/review.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Review]), ProductsModule],
  controllers: [AdminsReviewsController, ReviewsController],
  providers: [ReviewsRepository, ReviewsService],
})
export class ReviewsModule {}
