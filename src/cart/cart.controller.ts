import { Controller, Post, Patch, Get, Delete, Param, ParseIntPipe, Body, Req } from '@nestjs/common'
import { CartService } from './cart.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Add product to cart
  @Post('products/:productId')
  @Auth()
  async addToCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.cartService.addToCart(
        req.user.id,
        productId,
        quantity,
      ),
      'Added to cart',
    )
  }
  
  // Get user cart
  @Get()
  @Auth()
  async getUserCart(@Req() req: any) {
    return buildResponse(
      await this.cartService.findUserCart(req.user.id),
      'Cart fetched successfully',
    )
  }

  // Get total cart item count
  @Get('count')
  @Auth()
  async getCartCount(@Req() req: any) {
    return buildResponse(
      await this.cartService.countUserCartItems(req.user.id),
      'Cart items counted successfully',
    )
  }

  // Update cart item quantity
  @Patch('products/:productId')
  @Auth()
  async updateQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.cartService.updateQuantity(
        req.user.id,
        productId,
        quantity,
      ),
      'Cart item updated successfully',
    )
  }

  // Remove a single product from cart
  @Delete('products/:productId')
  @Auth()
  async removeFromCart(@Param('productId') productId: number, @Req() req: any) {
    await this.cartService.removeFromCart(req.user.id, Number(productId))
    return buildResponse(null, 'Removed from cart')
  }

  // Clear all items in user cart
  @Delete('clear')
  @Auth()
  async clearCart(@Req() req: any) {
    await this.cartService.clearCart(req.user.id)
    return buildResponse(null, 'Cart cleared successfully')
  }
}