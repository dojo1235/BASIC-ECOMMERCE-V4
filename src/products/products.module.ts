import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsRepository } from './products.repository'
import { ProductsService } from './products.service'
import { AdminsProductsController } from './admins-products.controller'
import { ProductsController } from './products.controller'
import { ProductsImagesController } from './products-images.controller'
import { BrandsController } from './brands.controller'
import { CategoriesController } from './categories.controller'
import { Product } from './entities/product.entity'
import { ProductImage } from './entities/product-image.entity'
import { Brand } from './entities/brand.entity'
import { Category } from './entities/category.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, Brand, Category])],
  controllers: [
    AdminsProductsController,
    ProductsController,
    ProductsImagesController,
    BrandsController,
    CategoriesController,
  ],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsRepository],
})
export class ProductsModule {}
