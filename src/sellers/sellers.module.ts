import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from 'src/products/products.module'
import { UsersModule } from 'src/users/users.module'
import { SellersRepository } from './sellers.repository'
import { SellersService } from './sellers.service'
import { SellersController } from './sellers.controller'
import { SellersProductsController } from './sellers-products.controller'
import { AdminsSellersController } from './admins-sellers.controller'
import { Seller } from './entities/seller.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Seller]), ProductsModule, UsersModule],
  controllers: [SellersController, SellersProductsController, AdminsSellersController],
  providers: [SellersRepository, SellersService],
  exports: [SellersRepository],
})
export class SellersModule {}
