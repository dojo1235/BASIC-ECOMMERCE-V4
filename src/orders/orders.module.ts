import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from 'src/products/products.module'
import { CartModule } from 'src/cart/cart.module'
import { OrdersRepository } from './orders.repository'
import { OrdersService } from './orders.service'
import { AdminsOrdersController } from './admins-orders.controller'
import { OrdersController } from './orders.controller'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductsModule, CartModule],
  controllers: [AdminsOrdersController, OrdersController],
  providers: [OrdersRepository, OrdersService],
})
export class OrdersModule {}
