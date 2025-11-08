import { Controller, Get, Patch, Param, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { ReviewsService } from './reviews.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/users/entities/user.entity'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { ReviewIdParamDto } from 'src/common/dto/review-id-param.dto'
import { FindReviewsDto } from './dto/find-reviews.dto'
import { ReviewResponseDto } from './dto/review-response.dto'
import { ReviewsListResponseDto } from './dto/reviews-list-response.dto'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'

@Auth(Role.ProductManager)
@Controller('admins/reviews')
export class AdminsReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('products/:productId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch all reviews for a product' })
  @ApiSuccessResponse({
    description: 'Product reviews fetched successfully',
    type: ReviewsListResponseDto,
  })
  async findProductReviewsForAdmin(
    @Param() { productId }: ProductIdParamDto,
    @Query() query: FindReviewsDto,
  ): Promise<ReviewsListResponseDto> {
    return await this.reviewsService.findProductReviewsForAdmin(productId, query)
  }

  @Get(':reviewId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch a single review' })
  @ApiSuccessResponse({
    description: 'Review fetched successfully',
    type: ReviewResponseDto,
  })
  async findOneForAdmin(@Param() { reviewId }: ReviewIdParamDto): Promise<ReviewResponseDto> {
    return await this.reviewsService.findOneForAdmin(reviewId)
  }

  @Patch(':reviewId/hide')
  @ApiOperation({ summary: 'Hide a review' })
  @ApiSuccessResponse({
    description: 'Review hidden successfully',
    type: ReviewResponseDto,
  })
  async hideReview(
    @Param() { reviewId }: ReviewIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.updateReviewForAdmin(reviewId, {
      isVisible: false,
      hiddenById: user.id,
      hiddenAt: new Date(),
    })
  }

  @Patch(':reviewId/restore')
  @ApiOperation({ summary: 'Restore a review' })
  @ApiSuccessResponse({
    description: 'Review restored successfully',
    type: ReviewResponseDto,
  })
  async restoreReview(
    @Param() { reviewId }: ReviewIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ReviewResponseDto> {
    return await this.reviewsService.updateReviewForAdmin(reviewId, {
      isVisible: true,
      restoredById: user.id,
      restoredAt: new Date(),
    })
  }
}
