import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'
import { OrdersService } from './orders.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/users/entities/user.entity'
import { FindOrdersDto } from './dto/find-orders.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserIdParamDto } from '../common/dto/user-id-param.dto'
import { OrderIdParamDto } from '../common/dto/order-id-param.dto'
import { OrderResponseDto } from './dto/order-response.dto'
import { OrdersListResponseDto } from './dto/orders-list-response.dto'

@ApiBearerAuth()
@Controller('admins/orders')
export class AdminsOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get() // Fetch all orders
  @Auth(Role.OrderManager)
  @ApiOkResponse({ description: 'Orders fetched successfully', type: OrdersListResponseDto })
  async findAll(@Query() query: FindOrdersDto) {
    return {
      data: await this.ordersService.findAllOrders(query),
      message: 'Orders fetched successfully',
    }
  }

  @Get('users/:userId') // Fetch all orders for a specific user
  @Auth(Role.OrderManager)
  @ApiOkResponse({ description: 'User orders fetched successfully', type: OrdersListResponseDto })
  async findUserOrdersForAdmin(@Param() { userId }: UserIdParamDto, @Query() query: FindOrdersDto) {
    return {
      data: await this.ordersService.findUserOrdersForAdmin(userId, query),
      message: 'User orders fetched successfully',
    }
  }

  @Get(':orderId') // Fetch a single order
  @Auth(Role.OrderManager)
  @ApiOkResponse({ description: 'Order fetched successfully', type: OrderResponseDto })
  async findOneForAdmin(@Param() { orderId }: OrderIdParamDto) {
    return {
      data: await this.ordersService.findOneForAdmin(orderId),
      message: 'Order fetched successfully',
    }
  }

  @Patch(':orderId/status') // Update order status
  @Auth(Role.OrderManager)
  @ApiOkResponse({ description: 'Order status updated successfully', type: OrderResponseDto })
  async updateStatus(
    @Param() { orderId }: OrderIdParamDto,
    @Body() { status }: UpdateOrderStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.ordersService.updateOrder(orderId, {
        status,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Order status updated successfully',
    }
  }

  @Patch(':orderId/restore') // Restore order
  @Auth(Role.OrderManager)
  @ApiOkResponse({ description: 'Order restored successfully', type: OrderResponseDto })
  async restore(@Param() { orderId }: OrderIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.ordersService.updateOrder(orderId, {
        isDeleted: false,
        restoredById: user.id,
        restoredAt: new Date(),
      }),
      message: 'Order restored successfully',
    }
  }

  @Delete(':orderId') // Soft-delete order
  @Auth(Role.OrderManager)
  @ApiOkResponse({ description: 'Order deleted successfully', type: OrderResponseDto })
  async remove(@Param() { orderId }: OrderIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.ordersService.updateOrder(orderId, {
        isDeleted: true,
        deletedById: user.id,
        deletedAt: new Date(),
      }),
      message: 'Order deleted successfully',
    }
  }
}
