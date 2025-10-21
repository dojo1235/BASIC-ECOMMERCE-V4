import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { ReviewsService } from './reviews.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/users/entities/user.entity'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'
import { ReviewIdParamDto } from '../common/dto/review-id-param.dto'
import { FindReviewsDto } from './dto/find-reviews.dto'
import { ReviewResponseDto } from './dto/review-response.dto'
import { ReviewsListResponseDto } from './dto/reviews-list-response.dto'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'

@ApiBearerAuth()
@Controller('admins/reviews')
export class AdminsReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('products/:productId') // Fetch all reviews for a product
  @Auth(Role.ProductManager)
  @ApiOkResponse({
    description: 'Product reviews fetched successfully',
    type: ReviewsListResponseDto,
  })
  async findMany(@Param() { productId }: ProductIdParamDto, @Query() query: FindReviewsDto) {
    return {
      data: await this.reviewsService.findProductReviewsForAdmin(productId, query),
      message: 'Product reviews fetched successfully',
    }
  }

  @Get(':reviewId') // Fetch a single review
  @Auth(Role.ProductManager)
  @ApiOkResponse({ description: 'Review fetched successfully', type: ReviewResponseDto })
  async findOne(@Param() { reviewId }: ReviewIdParamDto) {
    return {
      data: await this.reviewsService.findOneForAdmin(reviewId),
      message: 'Review fetched successfully',
    }
  }

  @Patch(':reviewId/hide') // Hide a review
  @Auth(Role.ProductManager)
  @ApiOkResponse({ description: 'Review hidden successfully', type: ReviewResponseDto })
  async hide(@Param() { reviewId }: ReviewIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.reviewsService.updateReviewForAdmin(reviewId, {
        isVisible: false,
        hiddenById: user.id,
        hiddenAt: new Date(),
      }),
      message: 'Review hidden successfully',
    }
  }

  @Patch(':reviewId/restore') // Restore a review
  @Auth(Role.ProductManager)
  @ApiOkResponse({ description: 'Review restored successfully', type: ReviewResponseDto })
  async restore(@Param() { reviewId }: ReviewIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.reviewsService.updateReviewForAdmin(reviewId, {
        isVisible: true,
        restoredById: user.id,
        restoredAt: new Date(),
      }),
      message: 'Review restored successfully',
    }
  }
}
