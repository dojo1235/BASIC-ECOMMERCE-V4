import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { Role } from 'src/common/enums/roles.enum'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('admins/orders')
export class AdminsOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Get all orders
  @Get()
  @Auth(Role.OrderManager)
  async findAll(@Query() query: Record<string, any>) {
    return buildResponse(
      await this.ordersService.findAllOrders(query),
      'Orders fetched successfully',
    )
  }

  // Get all orders for a specific user
  @Get('users/:userId')
  @Auth(Role.OrderManager)
  async findUserOrdersForAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: Record<string, any>,
  ) {
    return buildResponse(
      await this.ordersService.findUserOrdersForAdmin(userId, query),
      'User orders fetched successfully',
    )
  }

  // Get a single order
  @Get(':orderId')
  @Auth(Role.OrderManager)
  async findOneForAdmin(@Param('orderId', ParseIntPipe) orderId: number) {
    return buildResponse(
      await this.ordersService.findOneForAdmin(orderId),
      'Order fetched successfully',
    )
  }

  // Update order status
  @Patch(':orderId/status')
  @Auth(Role.OrderManager)
  async updateStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() body: any,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.ordersService.updateOrder(orderId, {
        status: body.status,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'Order status updated successfully',
    )
  }

  // restore order
  @Patch(':orderId/restore')
  @Auth(Role.OrderManager)
  async restore(@Param('orderId', ParseIntPipe) orderId: number, @Req() req: any) {
    return buildResponse(
      await this.ordersService.updateOrder(orderId, {
        isDeleted: false,
        restoredBy: req.user.id,
        restoredAt: new Date(),
      }),
      'Order restored successfully',
    )
  }

  // Soft-Delete order
  @Delete(':orderId')
  @Auth(Role.OrderManager)
  async remove(@Param('orderId', ParseIntPipe) orderId: number, @Req() req: any) {
    return buildResponse(
      await this.ordersService.updateOrder(orderId, {
        isDeleted: true,
        deletedBy: req.user.id,
        deletedAt: new Date(),
      }),
      'Order deleted successfully',
    )
  }
}
