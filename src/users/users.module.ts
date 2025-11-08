import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { UsersRepository } from './users.repository'
import { UsersService } from './users.service'
import { SuperAdminsController } from './super-admins.controller'
import { AdminsUsersController } from './admins-users.controller'
import { AdminsController } from './admins.controller'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [SuperAdminsController, AdminsController, AdminsUsersController, UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
