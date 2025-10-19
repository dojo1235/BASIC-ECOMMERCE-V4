import { Controller, Post, Patch, Get, Delete, Param, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'
import { CartService } from './cart.service'
import { Auth } from '../common/decorators/auth.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator'
import { CartListResponseDto } from './dto/cart-list-response.dto'
import { CartItemResponseDto } from './dto/cart-item-response.dto'
import { QuantityDto } from './dto/quantity.dto'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'

@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('products/:productId') // Add product to cart
  @Auth()
  @ApiCreatedResponse({
    description: 'Product added to cart successfully',
    type: CartItemResponseDto,
  })
  async addToCart(
    @Param() { productId }: ProductIdParamDto,
    @Body() { quantity }: QuantityDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.cartService.addToCart(user.id, productId, quantity),
      message: 'Product added to cart successfully',
    }
  }

  @Get() // Get user cart
  @Auth()
  @ApiOkResponse({
    description: 'Cart fetched successfully',
    type: CartListResponseDto,
  })
  async getUserCart(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.cartService.findUserCart(user.id),
      message: 'Cart fetched successfully',
    }
  }

  @Get('count') // Get total cart item count
  @Auth()
  @ApiOkResponse({ description: 'Cart items counted successfully' })
  async getCartCount(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.cartService.countUserCartItems(user.id),
      message: 'Cart items counted successfully',
    }
  }

  @Patch('products/:productId') // Update cart item quantity
  @Auth()
  @ApiOkResponse({
    description: 'Cart item updated successfully',
    type: CartItemResponseDto,
  })
  async updateQuantity(
    @Param() { productId }: ProductIdParamDto,
    @Body() { quantity }: QuantityDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.cartService.updateQuantity(user.id, productId, quantity),
      message: 'Cart item updated successfully',
    }
  }

  @Delete('products/:productId') // Remove a single product from cart
  @Auth()
  @ApiOkResponse({ description: 'Product removed from cart successfully' })
  async removeFromCart(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.cartService.removeFromCart(user.id, productId),
      message: 'Product removed from cart successfully',
    }
  }

  @Delete('clear') // Clear all items in user cart
  @Auth()
  @ApiOkResponse({ description: 'Cart cleared successfully' })
  async clearCart(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.cartService.clearCart(user.id),
      message: 'Cart cleared successfully',
    }
  }
}
