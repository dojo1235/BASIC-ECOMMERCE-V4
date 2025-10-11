import { Controller, Get, Post, Patch, Param,
Body, Req, ParseIntPipe, Query } from '@nestjs/common'
import { ReviewsService } from './reviews.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Create a review
  @Post('product/:productId')
  @Auth()
  async create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: { rating: number; comment: string },
    @Req() req: any,
  ) {
    const { rating, comment } = body
    return buildResponse(
      await this.reviewsService.createReview(req.user.id, productId, rating, comment),
      'Review created successfully',
    )
  }

  // Get all reviews for a product
  @Get('product/:productId')
  async findMany(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() query: Record<string, any>,
  ) {
    return buildResponse(
      await this.reviewsService.findProductReviews(productId, query),
      'Product reviews fetched successfully',
    )
  }

  // Get user review for a product
  @Get('product/:productId/me')
  @Auth()
  async findOne(
    @Req() req: any,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return buildResponse(
      await this.reviewsService.findUserReview(productId, req.user.id),
      'Review fetched successfully',
    )
  }

  // Update user review
  @Patch('product/:productId')
  @Auth()
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: { rating: number; comment: string },
    @Req() req: any,
  ) {
    const { rating, comment } = body
    return buildResponse(
      await this.reviewsService.updateReview(req.user.id, productId, rating, comment),
      'Review updated successfully',
    )
  }
}