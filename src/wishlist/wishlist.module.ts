import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from 'src/products/products.module'
import { WishlistRepository } from './wishlist.repository'
import { WishlistService } from './wishlist.service'
import { WishlistController } from './wishlist.controller'
import { Wishlist } from './entities/wishlist.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), ProductsModule],
  controllers: [WishlistController],
  providers: [WishlistRepository, WishlistService],
})
export class WishlistModule {}
