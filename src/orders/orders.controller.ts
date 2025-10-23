import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { PlaceOrderDto } from './dto/place-order.dto'
import { FindOrdersDto } from './dto/find-orders.dto'
import { OrderIdParamDto } from '../common/dto/order-id-param.dto'
import { plainToInstance } from 'class-transformer'
import { OrderResponseDto } from './dto/order-response.dto'
import { OrdersListResponseDto } from './dto/orders-list-response.dto'

@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Place new order' })
  @ApiCreatedResponse({
    description: 'Order placed successfully',
    type: OrderResponseDto,
  })
  async placeOrder(@Body() data: PlaceOrderDto, @CurrentUser() user: CurrentUserPayload) {
    const result = await this.ordersService.placeOrder(user.id, data)
    return {
      data: plainToInstance(OrderResponseDto, result),
      message: 'Order placed successfully',
    }
  }

  @Get()
  @Auth()
  @ApiOperation({ summary: 'Fetch all orders of the logged-in user' })
  @ApiOkResponse({
    description: 'Orders fetched successfully',
    type: OrdersListResponseDto,
  })
  async findMyOrders(@Query() query: FindOrdersDto, @CurrentUser() user: CurrentUserPayload) {
    const result = await this.ordersService.findUserOrders(user.id, query)
    return {
      data: plainToInstance(OrdersListResponseDto, result),
      message: 'Orders fetched successfully',
    }
  }

  @Get(':orderId')
  @Auth()
  @ApiOperation({ summary: 'Fetch a single order of the logged-in user' })
  @ApiOkResponse({
    description: 'Order fetched successfully',
    type: OrderResponseDto,
  })
  async findMyOrder(
    @Param() { orderId }: OrderIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const result = await this.ordersService.findOne(user.id, orderId)
    return {
      data: plainToInstance(OrderResponseDto, result),
      message: 'Order fetched successfully',
    }
  }

  @Patch(':orderId/cancel')
  @Auth()
  @ApiOperation({ summary: 'Cancel an order of the logged-in user' })
  @ApiOkResponse({
    description: 'Order cancelled successfully',
    type: OrderResponseDto,
  })
  async cancelOrder(
    @Param() { orderId }: OrderIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    const result = await this.ordersService.cancelOrder(user.id, orderId)
    return {
      data: plainToInstance(OrderResponseDto, result),
      message: 'Order cancelled successfully',
    }
  }
}
