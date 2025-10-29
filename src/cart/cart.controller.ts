import { Controller, Post, Patch, Get, Delete, Param, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { CartService } from './cart.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { ProductIdParamDto } from 'src/common/dto/product-id-param.dto'
import { QuantityDto } from './dto/quantity.dto'
import { CartListResponseDto } from './dto/cart-list-response.dto'
import { CartItemResponseDto } from './dto/cart-item-response.dto'
import { CartCountResponseDto } from './dto/cart-count-response.dto'
import { CartTotalResponseDto } from './dto/cart-total-response.dto'

@Auth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('products/:productId')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiSuccessResponse({
    description: 'Product added to cart successfully',
    type: CartItemResponseDto,
    status: HttpStatus.CREATED,
  })
  async addToCart(
    @Param() { productId }: ProductIdParamDto,
    @Body() { quantity }: QuantityDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.addToCart(user.id, productId, quantity)
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiSuccessResponse({ description: 'Cart fetched successfully', type: CartListResponseDto })
  async getUserCart(@CurrentUser() user: CurrentUserPayload): Promise<CartListResponseDto> {
    return await this.cartService.findUserCart(user.id)
  }

  @Get('count')
  @ApiOperation({ summary: 'Get cart items count' })
  @ApiSuccessResponse({
    description: 'Cart items counted successfully',
    type: CartCountResponseDto,
  })
  async getCartCount(@CurrentUser() user: CurrentUserPayload): Promise<CartCountResponseDto> {
    return await this.cartService.countUserCartItems(user.id)
  }

  @Get('total')
  @ApiOperation({ summary: 'Get the total price of all items in cart' })
  @ApiSuccessResponse({
    description: 'Cart total fetched successfully',
    type: CartTotalResponseDto,
  })
  async getCartTotal(@CurrentUser() user: CurrentUserPayload): Promise<CartTotalResponseDto> {
    return await this.cartService.getTotal(user.id)
  }

  @Patch('products/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiSuccessResponse({ description: 'Cart item updated successfully', type: CartItemResponseDto })
  async updateQuantity(
    @Param() { productId }: ProductIdParamDto,
    @Body() { quantity }: QuantityDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<CartItemResponseDto> {
    return await this.cartService.updateQuantity(user.id, productId, quantity)
  }

  @Delete('products/:productId')
  @ApiOperation({ summary: 'Remove a single product from cart' })
  @ApiSuccessResponse({ description: 'Product removed from cart successfully' })
  async removeFromCart(
    @Param() { productId }: ProductIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return await this.cartService.removeFromCart(user.id, productId)
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all items in user cart' })
  @ApiSuccessResponse({ description: 'Cart cleared successfully' })
  async clearCart(@CurrentUser() user: CurrentUserPayload): Promise<void> {
    return await this.cartService.clearCart(user.id)
  }
}
