import { Module } from '@nestjs/common'
import { ProductsService } from './products.service'
import { AdminsProductsController } from './admins-products.controller'
import { ProductsController } from './products.controller'

@Module({
  imports: [],
  controllers: [
    AdminsProductsController,
    ProductsController,
    ],
  providers: [ProductsService],
})
export class ProductsModule {}