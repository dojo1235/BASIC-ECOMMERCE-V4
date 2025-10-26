import { Controller, Get, Post, Patch, Body, Param, Query, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { PlaceOrderDto } from './dto/place-order.dto'
import { FindOrdersDto } from './dto/find-orders.dto'
import { OrderIdParamDto } from '../common/dto/order-id-param.dto'
import { plainToInstance } from 'class-transformer'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { OrderResponseDto } from './dto/order-response.dto'
import { OrdersListResponseDto } from './dto/orders-list-response.dto'

@Auth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place new order' })
  @ApiSuccessResponse({
    description: 'Order placed successfully',
    type: OrderResponseDto,
    status: HttpStatus.CREATED,
  })
  async placeOrder(@Body() data: PlaceOrderDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(OrderResponseDto, {
      data: await this.ordersService.placeOrder(user.id, data),
      message: 'Order placed successfully',
    })
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all orders of the logged-in user' })
  @ApiSuccessResponse({ description: 'Orders fetched successfully', type: OrdersListResponseDto })
  async findMyOrders(@Query() query: FindOrdersDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(OrdersListResponseDto, {
      data: await this.ordersService.findUserOrders(user.id, query),
      message: 'Orders fetched successfully',
    })
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Fetch a single order of the logged-in user' })
  @ApiSuccessResponse({ description: 'Order fetched successfully', type: OrderResponseDto })
  async findMyOrder(
    @Param() { orderId }: OrderIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(OrderResponseDto, {
      data: await this.ordersService.findOne(user.id, orderId),
      message: 'Order fetched successfully',
    })
  }

  @Patch(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order of the logged-in user' })
  @ApiSuccessResponse({ description: 'Order cancelled successfully', type: OrderResponseDto })
  async cancelOrder(
    @Param() { orderId }: OrderIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(OrderResponseDto, {
      data: await this.ordersService.cancelOrder(user.id, orderId),
      message: 'Order cancelled successfully',
    })
  }
}
