import { Module } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { AdminsOrdersController } from './admins-orders.controller'
import { OrdersController } from './orders.controller'

@Module({
  imports: [],
  controllers: [AdminsOrdersController, OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
