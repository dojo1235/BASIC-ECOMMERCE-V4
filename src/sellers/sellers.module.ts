import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from 'src/products/products.module'
import { CountriesModule } from 'src/countries/countries.module'
import { UsersModule } from 'src/users/users.module'
import { SellersRepository } from './sellers.repository'
import { SellersService } from './sellers.service'
import { AdminsSellersController } from './admins-sellers.controller'
import { SellersController } from './sellers.controller'
import { SellersBrandsController } from './sellers-brands.controller'
import { AdminsSellersBrandsAuthorizationsController } from './admins-sellers-brands-authorizations.controller'
import { SellersBrandsAuthorizationsController } from './sellers-brands-authorizations.controller'
import { SellersProductsController } from './sellers-products.controller'
import { SellersProductsImagesController } from './sellers-products-images.controller'
import { Seller } from './entities/seller.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Seller]), ProductsModule, CountriesModule, UsersModule],
  controllers: [
    AdminsSellersController,
    SellersController,
    SellersBrandsController,
    AdminsSellersBrandsAuthorizationsController,
    SellersBrandsAuthorizationsController,
    SellersProductsController,
    SellersProductsImagesController,
  ],
  providers: [SellersRepository, SellersService],
  exports: [SellersRepository],
})
export class SellersModule {}
