import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { NamingStrategy } from '../database/naming.strategy'

export const dataSourceOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),
    entities: [],
    synchronize: true,
    logging: true,
    namingStrategy: new NamingStrategy(),
  }),
}
