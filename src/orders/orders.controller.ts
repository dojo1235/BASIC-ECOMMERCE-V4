import { Controller, Get, Post, Patch, Param, Body, Req, ParseIntPipe, Query } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Place new order
  @Post()
  @Auth()
  async placeOrder(@Body() payload: { contact: string; shippingAddress: string }, @Req() req: any) {
    return buildResponse(
      await this.ordersService.placeOrder(req.user.id, payload),
      'Order placed successfully',
    )
  }

  // Get user orders
  @Get()
  @Auth()
  async findMyOrders(@Query() query: Record<string, any>, @Req() req: any) {
    return buildResponse(
      await this.ordersService.findUserOrders(req.user.id, query),
      'Orders fetched successfully',
    )
  }

  // Get a single order for user
  @Get(':orderId')
  @Auth()
  async findMyOrder(@Param('orderId', ParseIntPipe) orderId: number, @Req() req: any) {
    return buildResponse(
      await this.ordersService.findOne(req.user.id, orderId),
      'Order fetched successfully',
    )
  }

  // Cancel an order
  @Patch(':orderId/cancel')
  @Auth()
  async cancelOrder(@Param('orderId', ParseIntPipe) orderId: number, @Req() req: any) {
    return buildResponse(
      await this.ordersService.cancelOrder(req.user.id, orderId),
      'Order cancelled successfully',
    )
  }
}
