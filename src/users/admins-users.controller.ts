import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { Role, User } from 'src/users/entities/user.entity'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { UsersListResponseDto } from './dto/users-list-response.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'

@ApiBearerAuth()
@Controller('admins/users')
export class AdminsUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // Fetch all users
  @Auth(Role.ViewOnlyAdmin)
  @ApiOkResponse({ description: 'Users fetched successfully', type: UsersListResponseDto })
  async findAll(@Query() query: FindUsersDto) {
    return {
      data: await this.usersService.findAllUsers(query),
      message: 'Users fetched successfully',
    }
  }

  @Get(':userId') // Fetch a single user
  @Auth(Role.ViewOnlyAdmin)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'User fetched successfully', type: UserResponseDto })
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    return {
      data: await this.usersService.findOneUser(userId),
      message: 'User fetched successfully',
    }
  }

  @Patch(':userId') // Update user
  @Auth(Role.UserManager)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'User updated successfully', type: UserResponseDto })
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user,
  ) {
    return {
      data: await this.usersService.updateUserForAdmin(userId, {
        ...updateUserDto,
        updatedBy: user.id,
        updatedAt: new Date(),
      }),
      message: 'User updated successfully',
    }
  }

  @Patch(':userId/role') // Update user role
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'User role updated successfully', type: UserResponseDto })
  async updateRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() { role }: UpdateUserRoleDto,
    @CurrentUser() user,
  ) {
    return {
      data: await this.usersService.updateUserForAdmin(userId, {
        role,
        updatedBy: user.id,
        updatedAt: new Date(),
      }),
      message: 'User role updated successfully',
    }
  }

  @Patch(':userId/ban') // Ban user
  @Auth(Role.UserManager)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'User banned successfully', type: UserResponseDto })
  async ban(@Param('userId', ParseIntPipe) userId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.updateUserForAdmin(userId, {
        isBanned: true,
        bannedBy: user.id,
        bannedAt: new Date(),
      }),
      message: 'User banned successfully',
    }
  }

  @Patch(':userId/restore') // Restore user
  @Auth(Role.UserManager)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'User restored successfully', type: UserResponseDto })
  async restore(@Param('userId', ParseIntPipe) userId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.updateUserForAdmin(userId, {
        isBanned: false,
        isDeleted: false,
        restoredBy: user.id,
        restoredAt: new Date(),
      }),
      message: 'User restored successfully',
    }
  }

  @Patch(':userId/revoke-sessions') // Revoke all sessions
  @Auth(Role.UserManager)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'All user sessions revoked successfully' })
  async revokeAllSessions(@Param('userId', ParseIntPipe) userId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.revokeAllUserSessions(userId, user.id),
      message: 'All user sessions revoked successfully',
    }
  }

  @Delete(':userId') // Soft-delete user
  @Auth(Role.UserManager)
  @ApiParam({ name: 'userId', type: Number })
  @ApiOkResponse({ description: 'User deleted successfully', type: UserResponseDto })
  async remove(@Param('userId', ParseIntPipe) userId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.updateUserForAdmin(userId, {
        isDeleted: true,
        deletedBy: user.id,
        deletedAt: new Date(),
      }),
      message: 'User deleted successfully',
    }
  }
}