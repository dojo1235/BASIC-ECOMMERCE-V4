import { Controller, Get, Post, Delete, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'
import { WishlistService } from './wishlist.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'
import { FindWishlistDto } from './dto/find-wishlist.dto'
import { WishlistResponseDto } from './dto/wishlist-response.dto'

@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('products/:productId')
  @Auth()
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiCreatedResponse({ description: 'Product added to wishlist successfully' })
  async addProduct(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.wishlistService.addProductToWishlist(user.id, productId),
      message: 'Product added to wishlist successfully',
    }
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Get all wishlist items for the logged-in user' })
  @ApiOkResponse({ description: 'Wishlist fetched successfully', type: WishlistResponseDto })
  async findAll(@Query() query: FindWishlistDto, @CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.wishlistService.findWishlist(user.id, query),
      message: 'Wishlist fetched successfully',
    }
  }

  @Get('count')
  @Auth()
  @ApiOperation({ summary: 'Count total wishlist items for the logged-in user' })
  @ApiOkResponse({ description: 'Wishlist counted successfully' })
  async count(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.wishlistService.countWishlistItems(user.id),
      message: 'Wishlist counted successfully',
    }
  }

  @Delete('products/:productId')
  @Auth()
  @ApiOperation({ summary: 'Remove a product from the wishlist' })
  @ApiOkResponse({ description: 'Product removed from wishlist successfully' })
  async removeProduct(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.wishlistService.removeProductFromWishlist(user.id, productId),
      message: 'Product removed from wishlist successfully',
    }
  }
}
