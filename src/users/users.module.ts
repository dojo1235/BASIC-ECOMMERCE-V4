import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CountriesModule } from 'src/countries/countries.module'
import { AuthModule } from '../auth/auth.module'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'
import { SuperAdminsController } from './super-admins.controller'
import { AdminsUsersController } from './admins-users.controller'
import { AdminsController } from './admins.controller'
import { UsersController } from './users.controller'
import { ProfilesController } from './profiles.controller'
import { AddressesController } from './addresses.controller'
import { User } from './entities/user.entity'
import { Profile } from './entities/profile.entity'
import { Address } from './entities/address.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Address]),
    forwardRef(() => AuthModule),
    CountriesModule,
  ],
  controllers: [
    SuperAdminsController,
    AdminsController,
    AdminsUsersController,
    UsersController,
    ProfilesController,
    AddressesController,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
