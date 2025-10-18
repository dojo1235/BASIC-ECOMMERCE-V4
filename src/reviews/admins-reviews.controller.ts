import { Controller, Get, Patch, Param, Body, Req, ParseIntPipe, Query } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/common/enums/roles.enum'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('admins/reviews')
export class AdminsReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Get all reviews for a product
  @Get('products/:productId')
  @Auth(Role.ProductManager)
  async findMany(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() query: Record<string, any>,
  ) {
    return buildResponse(
      await this.reviewsService.findProductReviewsForAdmin(productId, query),
      'Product reviews fetched successfully',
    )
  }

  // Get a single review
  @Get(':reviewId')
  @Auth(Role.ProductManager)
  async findOne(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return buildResponse(
      await this.reviewsService.findOneForAdmin(reviewId),
      'Review fetched successfully',
    )
  }

  // Hide review
  @Patch(':reviewId/hide')
  @Auth(Role.ProductManager)
  async hide(@Param('reviewId', ParseIntPipe) reviewId: number, @Req() req: any) {
    return buildResponse(
      await this.reviewsService.updateReviewForAdmin(reviewId, {
        isVisible: false,
        hiddenBy: req.user.id,
        hiddenAt: new Date(),
      }),
      'Review hidden successfully',
    )
  }

  // restore review
  @Patch(':reviewId/restore')
  @Auth(Role.ProductManager)
  async restore(@Param('reviewId', ParseIntPipe) reviewId: number, @Req() req: any) {
    return buildResponse(
      await this.reviewsService.updateReviewForAdmin(reviewId, {
        isVisible: true,
        restoredBy: req.user.id,
        restoredAt: new Date(),
      }),
      'Review restored successfully',
    )
  }
}
