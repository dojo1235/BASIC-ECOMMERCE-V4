import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CountriesModule } from 'src/countries/countries.module'
import { ProductsRepository } from './products.repository'
import { ProductsService } from './products.service'
import { AdminsProductsController } from './admins-products.controller'
import { ProductsController } from './products.controller'
import { AdminsProductsImagesController } from './admins-products-images.controller'
import { ProductsImagesController } from './products-images.controller'
import { AdminsBrandsController } from './admins-brands.controller'
import { BrandsController } from './brands.controller'
import { AdminsCategoriesController } from './admins-categories.controller'
import { CategoriesController } from './categories.controller'
import { Product } from './entities/product.entity'
import { ProductImage } from './entities/product-image.entity'
import { Brand } from './entities/brand.entity'
import { BrandAuthorization } from './entities/brand-authorization.entity'
import { Category } from './entities/category.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, Brand, BrandAuthorization, Category]),
    CountriesModule,
  ],
  controllers: [
    AdminsProductsController,
    ProductsController,
    AdminsProductsImagesController,
    ProductsImagesController,
    AdminsBrandsController,
    BrandsController,
    AdminsCategoriesController,
    CategoriesController,
  ],
  providers: [ProductsRepository, ProductsService],
  exports: [ProductsRepository],
})
export class ProductsModule {}
