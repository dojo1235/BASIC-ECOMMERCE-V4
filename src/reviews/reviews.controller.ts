import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { ReviewsService } from './reviews.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ReviewDto } from './dto/review.dto'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'
import { FindReviewsDto } from './dto/find-reviews.dto'
import { ReviewResponseDto } from './dto/review-response.dto'
import { ReviewsListResponseDto } from './dto/reviews-list-response.dto'

@ApiBearerAuth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('products/:productId') // Create a review
  @Auth()
  @ApiCreatedResponse({ description: 'Review created successfully', type: ReviewResponseDto })
  async create(
    @Param() { productId }: ProductIdParamDto,
    @Body() { rating, comment }: ReviewDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.reviewsService.createReview(user.id, productId, rating, comment),
      message: 'Review created successfully',
    }
  }

  @Get('products/:productId') // Get all reviews for a product
  @ApiOkResponse({
    description: 'Product reviews fetched successfully',
    type: ReviewsListResponseDto,
  })
  async findMany(@Param() { productId }: ProductIdParamDto, @Query() query: FindReviewsDto) {
    return {
      data: await this.reviewsService.findProductReviews(productId, query),
      message: 'Product reviews fetched successfully',
    }
  }

  @Get('products/:productId/me') // Get the logged-in user's review for a product
  @Auth()
  @ApiOkResponse({ description: 'User review fetched successfully', type: ReviewResponseDto })
  async findOne(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.reviewsService.findUserReview(productId, user.id),
      message: 'Review fetched successfully',
    }
  }

  @Patch('products/:productId') // Update user review
  @Auth()
  @ApiOkResponse({ description: 'Review updated successfully', type: ReviewResponseDto })
  async update(
    @Param() { productId }: ProductIdParamDto,
    @Body() { rating, comment }: ReviewDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.reviewsService.updateReview(user.id, productId, rating, comment),
      message: 'Review updated successfully',
    }
  }
}
