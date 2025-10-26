import { Controller, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/users/entities/user.entity'
import { FindOrdersDto } from './dto/find-orders.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserIdParamDto } from '../common/dto/user-id-param.dto'
import { OrderIdParamDto } from '../common/dto/order-id-param.dto'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { OrderResponseDto } from './dto/order-response.dto'
import { OrdersListResponseDto } from './dto/orders-list-response.dto'
import { plainToInstance } from 'class-transformer'

@Auth(Role.OrderManager)
@Controller('admins/orders')
export class AdminsOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch all orders' })
  @ApiSuccessResponse({ description: 'Orders fetched successfully', type: OrdersListResponseDto })
  async findAll(@Query() query: FindOrdersDto) {
    return plainToInstance(OrdersListResponseDto, {
      data: await this.ordersService.findAllOrders(query),
      message: 'Orders fetched successfully',
    })
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Fetch all orders for a specific user' })
  @ApiSuccessResponse({
    description: 'User orders fetched successfully',
    type: OrdersListResponseDto,
  })
  async findUserOrdersForAdmin(@Param() { userId }: UserIdParamDto, @Query() query: FindOrdersDto) {
    return plainToInstance(OrdersListResponseDto, {
      data: await this.ordersService.findUserOrdersForAdmin(userId, query),
      message: 'User orders fetched successfully',
    })
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Fetch a single order' })
  @ApiSuccessResponse({ description: 'Order fetched successfully', type: OrderResponseDto })
  async findOneForAdmin(@Param() { orderId }: OrderIdParamDto) {
    return plainToInstance(OrderResponseDto, {
      data: await this.ordersService.findOneForAdmin(orderId),
      message: 'Order fetched successfully',
    })
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiSuccessResponse({ description: 'Order status updated successfully', type: OrderResponseDto })
  async updateStatus(
    @Param() { orderId }: OrderIdParamDto,
    @Body() { status }: UpdateOrderStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(OrderResponseDto, {
      data: await this.ordersService.updateOrder(orderId, {
        status,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Order status updated successfully',
    })
  }

  @Patch(':orderId/restore')
  @ApiOperation({ summary: 'Restore order' })
  @ApiSuccessResponse({ description: 'Order restored successfully', type: OrderResponseDto })
  async restore(@Param() { orderId }: OrderIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(OrderResponseDto, {
      data: await this.ordersService.updateOrder(orderId, {
        isDeleted: false,
        restoredById: user.id,
        restoredAt: new Date(),
      }),
      message: 'Order restored successfully',
    })
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Soft-delete order' })
  @ApiSuccessResponse({ description: 'Order deleted successfully', type: OrderResponseDto })
  async remove(@Param() { orderId }: OrderIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(OrderResponseDto, {
      data: await this.ordersService.updateOrder(orderId, {
        isDeleted: true,
        deletedById: user.id,
        deletedAt: new Date(),
      }),
      message: 'Order deleted successfully',
    })
  }
}
