import { Controller, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { OrdersService } from './orders.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/users/entities/user.entity'
import { FindOrdersDto } from './dto/find-orders.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserIdParamDto } from 'src/common/dto/user-id-param.dto'
import { OrderIdParamDto } from 'src/common/dto/order-id-param.dto'
import { OrderResponseDto } from './dto/order-response.dto'
import { OrdersListResponseDto } from './dto/orders-list-response.dto'

@Auth(Role.OrderManager)
@Controller('admins/orders')
export class AdminsOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch all orders' })
  @ApiSuccessResponse({ description: 'Orders fetched successfully', type: OrdersListResponseDto })
  async findAllOrders(@Query() query: FindOrdersDto): Promise<OrdersListResponseDto> {
    return await this.ordersService.findAllOrders(query)
  }

  @Get('users/:userId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch all orders for a specific user' })
  @ApiSuccessResponse({
    description: 'User orders fetched successfully',
    type: OrdersListResponseDto,
  })
  async findUserOrdersForAdmin(
    @Param() { userId }: UserIdParamDto,
    @Query() query: FindOrdersDto,
  ): Promise<OrdersListResponseDto> {
    return await this.ordersService.findUserOrdersForAdmin(userId, query)
  }

  @Get(':orderId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch a single order' })
  @ApiSuccessResponse({ description: 'Order fetched successfully', type: OrderResponseDto })
  async findOneOrderForAdmin(@Param() { orderId }: OrderIdParamDto): Promise<OrderResponseDto> {
    return await this.ordersService.findOneForAdmin(orderId)
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiSuccessResponse({ description: 'Order status updated successfully', type: OrderResponseDto })
  async updateOrderStatus(
    @Param() { orderId }: OrderIdParamDto,
    @Body() { status }: UpdateOrderStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.updateOrder(orderId, {
      status,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':orderId/restore')
  @ApiOperation({ summary: 'Restore order' })
  @ApiSuccessResponse({ description: 'Order restored successfully', type: OrderResponseDto })
  async restoreOrder(
    @Param() { orderId }: OrderIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.updateOrder(orderId, {
      isDeleted: false,
      restoredById: user.id,
      restoredAt: new Date(),
    })
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Soft-delete order' })
  @ApiSuccessResponse({ description: 'Order deleted successfully', type: OrderResponseDto })
  async deleteOrder(
    @Param() { orderId }: OrderIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<OrderResponseDto> {
    return await this.ordersService.updateOrder(orderId, {
      isDeleted: true,
      deletedById: user.id,
      deletedAt: new Date(),
    })
  }
}
