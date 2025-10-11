import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { SuperAdminsController } from './super-admins.controller'
import { AdminsUsersController } from './admins-users.controller'
import { AdminsController } from './admins.controller'
import { UsersController } from './users.controller'

@Module({
  imports: [],
  controllers: [
    SuperAdminsController,
    AdminsController,
    AdminsUsersController,
    UsersController,
  ],
  providers: [UsersService],
})
export class UsersModule {}
