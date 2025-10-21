import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { NamingStrategy } from '../database/naming.strategy'
import { RefreshToken } from 'src/auth/entities/refresh-token.entity'
import { User } from 'src/users/entities/user.entity'
import { Product } from 'src/products/entities/product.entity'
import { Cart } from 'src/cart/entities/cart.entity'
import { Order, OrderItem } from 'src/orders/entities/order.entity'
import { Review } from 'src/reviews/entities/review.entity'
import { Wishlist } from 'src/wishlist/entities/wishlist.entity'

export const dataSourceOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),
    entities: [RefreshToken, User, Product, Cart, Order, OrderItem, Review, Wishlist],
    synchronize: true,
    logging: true,
    namingStrategy: new NamingStrategy(),
  }),
}
