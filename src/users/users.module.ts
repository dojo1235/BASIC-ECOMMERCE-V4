import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'
import { SuperAdminsController } from './super-admins.controller'
import { AdminsUsersController } from './admins-users.controller'
import { AdminsController } from './admins.controller'
import { UsersController } from './users.controller'
import { ProfileController } from './profile.controller'
import { AddressController } from './address.controller'
import { User } from './entities/user.entity'
import { Profile } from './entities/profile.entity'
import { Address } from './entities/address.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Address]), forwardRef(() => AuthModule)],
  controllers: [
    SuperAdminsController,
    AdminsController,
    AdminsUsersController,
    UsersController,
    ProfileController,
    AddressController,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
