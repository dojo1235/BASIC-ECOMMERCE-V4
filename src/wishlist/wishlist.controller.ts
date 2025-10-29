import { Controller, Get, Post, Delete, Param, Query, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { WishlistService } from './wishlist.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { FindWishlistDto } from './dto/find-wishlist.dto'
import { WishlistResponseDto } from './dto/wishlist-response.dto'
import { WishlistCountResponseDto } from './dto/wishlist-count-response.dto'

@Auth()
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('products/:productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiSuccessResponse({
    description: 'Product added to wishlist successfully',
    status: HttpStatus.CREATED,
  })
  async addProduct(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return await this.wishlistService.addProductToWishlist(user.id, productId)
  }

  @Get()
  @ApiOperation({ summary: 'Get all wishlist items for the logged-in user' })
  @ApiSuccessResponse({ description: 'Wishlist fetched successfully', type: WishlistResponseDto })
  async findAll(
    @Query() query: FindWishlistDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<WishlistResponseDto> {
    return await this.wishlistService.findWishlist(user.id, query)
  }

  @Get('count')
  @ApiOperation({ summary: 'Count total wishlist items for the logged-in user' })
  @ApiSuccessResponse({
    description: 'Wishlist counted successfully',
    type: WishlistCountResponseDto,
  })
  async count(@CurrentUser() user: CurrentUserPayload): Promise<WishlistCountResponseDto> {
    return await this.wishlistService.countWishlistItems(user.id)
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Remove a product from the wishlist' })
  @ApiSuccessResponse({ description: 'Product removed from wishlist successfully' })
  async removeProduct(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return await this.wishlistService.removeProductFromWishlist(user.id, productId)
  }
}
