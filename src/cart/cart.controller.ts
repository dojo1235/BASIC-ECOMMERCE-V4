import { Controller, Post, Patch, Get, Delete, Param, Body } from '@nestjs/common'
import { ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'
import { CartService } from './cart.service'
import { Auth } from '../common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { CartListResponseDto } from './dto/cart-list-response.dto'
import { CartItemResponseDto } from './dto/cart-item-response.dto'
import { QuantityDto } from './dto/quantity.dto'
import { ProductIdParamDto } from '../common/dto/product-id-param.dto'
import { plainToInstance } from 'class-transformer'

@Auth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('products/:productId')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiCreatedResponse({
    description: 'Product added to cart successfully',
    type: CartItemResponseDto,
  })
  async addToCart(
    @Param() { productId }: ProductIdParamDto,
    @Body() { quantity }: QuantityDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(CartItemResponseDto, {
      data: await this.cartService.addToCart(user.id, productId, quantity),
      message: 'Product added to cart successfully',
    })
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiOkResponse({
    description: 'Cart fetched successfully',
    type: CartListResponseDto,
  })
  async getUserCart(@CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(CartListResponseDto, {
      data: await this.cartService.findUserCart(user.id),
      message: 'Cart fetched successfully',
    })
  }

  @Get('count')
  @ApiOperation({ summary: 'Get cart items count' })
  @ApiOkResponse({ description: 'Cart items counted successfully' })
  async getCartCount(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.cartService.countUserCartItems(user.id),
      message: 'Cart items counted successfully',
    }
  }

  @Get('total')
  @ApiOperation({ summary: 'Get the total price of all items in cart' })
  @ApiOkResponse({ description: 'Cart total fetched successfully' })
  async getCartTotal(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.cartService.getTotal(user.id),
      message: 'Cart total fetched successfully',
    }
  }

  @Patch('products/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiOkResponse({
    description: 'Cart item updated successfully',
    type: CartItemResponseDto,
  })
  async updateQuantity(
    @Param() { productId }: ProductIdParamDto,
    @Body() { quantity }: QuantityDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(CartItemResponseDto, {
      data: await this.cartService.updateQuantity(user.id, productId, quantity),
      message: 'Cart item updated successfully',
    })
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Remove a single product from cart' })
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

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all items in user cart' })
  @ApiOkResponse({ description: 'Cart cleared successfully' })
  async clearCart(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.cartService.clearCart(user.id),
      message: 'Cart cleared successfully',
    }
  }
}
