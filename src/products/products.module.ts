import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsRepository } from './products.repository'
import { ProductsService } from './products.service'
import { AdminsProductsController } from './admins-products.controller'
import { ProductsController } from './products.controller'
import { Product } from 'src/products/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [
    AdminsProductsController,
    ProductsController,
  ],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsRepository],
})
export class ProductsModule {}