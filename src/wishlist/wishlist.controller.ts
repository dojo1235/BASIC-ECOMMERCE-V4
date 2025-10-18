import { Controller, Get, Post, Delete, Param, Req, ParseIntPipe, Query } from '@nestjs/common'
import { WishlistService } from './wishlist.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // Add product to wishlist
  @Post('products/:productId')
  @Auth()
  async addProduct(@Param('productId', ParseIntPipe) productId: number, @Req() req: any) {
    return buildResponse(
      await this.wishlistService.addProductToWishlist(req.user.id, productId),
      'Product added to wishlist successfully',
    )
  }

  // Get all wishlist items
  @Get()
  @Auth()
  async findAll(@Query() query: Record<string, any>, @Req() req: any) {
    return buildResponse(
      await this.wishlistService.findWishlist(req.user.id, query),
      'Wishlist fetched successfully',
    )
  }

  // Count wishlist items
  @Get('count')
  @Auth()
  async count(@Req() req: any) {
    return buildResponse(
      await this.wishlistService.countWishlistItems(req.user.id),
      'Wishlist counted successfully',
    )
  }

  // Remove product from wishlist
  @Delete('products/:productId')
  @Auth()
  async removeProduct(@Param('productId', ParseIntPipe) productId: number, @Req() req: any) {
    return buildResponse(
      await this.wishlistService.removeProductFromWishlist(req.user.id, productId),
      'Product removed from wishlist successfully',
    )
  }
}
