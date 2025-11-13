import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from './config/orm.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ProductsModule } from './products/products.module'
import { CartModule } from './cart/cart.module'
import { OrdersModule } from './orders/orders.module'
import { ReviewsModule } from './reviews/reviews.module'
import { WishlistModule } from './wishlist/wishlist.module'
import { CountriesModule } from './countries/countries.module'
import { SellersModule } from './sellers/sellers.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(dataSourceOptions),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 300,
      },
    ]),
    AuthModule,
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    WishlistModule,
    CountriesModule,
    SellersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
