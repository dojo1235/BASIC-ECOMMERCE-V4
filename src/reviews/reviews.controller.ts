import { Controller, Get, Post, Patch, Body, Param, Query, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { ReviewsService } from './reviews.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ReviewDto } from './dto/review.dto'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { FindReviewsDto } from './dto/find-reviews.dto'
import { ReviewResponseDto } from './dto/review-response.dto'
import { ReviewsListResponseDto } from './dto/reviews-list-response.dto'

@Auth()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('products/:productId')
  @ApiOperation({ summary: 'Create a new review' })
  @ApiSuccessResponse({
    description: 'Review created successfully',
    type: ReviewResponseDto,
    status: HttpStatus.CREATED,
  })
  async createReview(
    @Param() { productId }: ProductIdParamDto,
    @Body() { rating, comment }: ReviewDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.createReview(user.id, productId, rating, comment)
  }

  @Get('products/:productId')
  @ApiOperation({ summary: 'Fetch all reviews for a product' })
  @ApiSuccessResponse({
    description: 'Product reviews fetched successfully',
    type: ReviewsListResponseDto,
  })
  async findProductReviews(
    @Param() { productId }: ProductIdParamDto,
    @Query() query: FindReviewsDto,
  ): Promise<ReviewsListResponseDto> {
    return await this.reviewsService.findProductReviews(productId, query)
  }

  @Get('products/:productId/me')
  @ApiOperation({ summary: "Fetch the logged-in user's review for a product" })
  @ApiSuccessResponse({
    description: 'User review fetched successfully',
    type: ReviewResponseDto,
  })
  async findUserReview(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.findUserReview(productId, user.id)
  }

  @Patch('products/:productId')
  @ApiOperation({ summary: 'Update an existing review' })
  @ApiSuccessResponse({
    description: 'Review updated successfully',
    type: ReviewResponseDto,
  })
  async updateReview(
    @Param() { productId }: ProductIdParamDto,
    @Body() { rating, comment }: ReviewDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.updateReview(user.id, productId, rating, comment)
  }
}
