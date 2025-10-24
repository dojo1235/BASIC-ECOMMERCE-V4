import { Controller, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { Role } from 'src/users/entities/user.entity'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersListResponseDto } from './dto/users-list-response.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { UserIdParamDto } from 'src/common/dto/user-id-param.dto'
import { plainToInstance } from 'class-transformer'

@Controller('admins/users')
export class AdminsUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiOkResponse({ description: 'Users fetched successfully', type: UsersListResponseDto })
  async findAll(@Query() query: FindUsersDto) {
    return plainToInstance(UsersListResponseDto, {
      data: await this.usersService.findAllUsers(query),
      message: 'Users fetched successfully',
    })
  }

  @Get(':userId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch a single user' })
  @ApiOkResponse({ description: 'User fetched successfully', type: UserResponseDto })
  async findOne(@Param() { userId }: UserIdParamDto) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.findOneUser(userId),
      message: 'User fetched successfully',
    })
  }

  @Patch(':userId')
  @Auth(Role.UserManager)
  @ApiOperation({ summary: 'Update user details' })
  @ApiOkResponse({ description: 'User updated successfully', type: UserResponseDto })
  async update(
    @Param() { userId }: UserIdParamDto,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateUserForAdmin(userId, {
        ...updateUserDto,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'User updated successfully',
    })
  }

  @Patch(':userId/role')
  @Auth(Role.SuperAdmin)
  @ApiOperation({ summary: 'Update user role' })
  @ApiOkResponse({ description: 'User role updated successfully', type: UserResponseDto })
  async updateRole(
    @Param() { userId }: UserIdParamDto,
    @Body() { role }: UpdateUserRoleDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateUserForAdmin(userId, {
        role,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'User role updated successfully',
    })
  }

  @Patch(':userId/ban')
  @Auth(Role.UserManager)
  @ApiOperation({ summary: 'Ban user' })
  @ApiOkResponse({ description: 'User banned successfully', type: UserResponseDto })
  async ban(@Param() { userId }: UserIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateUserForAdmin(userId, {
        isBanned: true,
        bannedById: user.id,
        bannedAt: new Date(),
      }),
      message: 'User banned successfully',
    })
  }

  @Patch(':userId/restore')
  @Auth(Role.UserManager)
  @ApiOperation({ summary: 'Restore user' })
  @ApiOkResponse({ description: 'User restored successfully', type: UserResponseDto })
  async restore(@Param() { userId }: UserIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateUserForAdmin(userId, {
        isBanned: false,
        isDeleted: false,
        restoredById: user.id,
        restoredAt: new Date(),
      }),
      message: 'User restored successfully',
    })
  }

  @Patch(':userId/revoke-sessions')
  @Auth(Role.UserManager)
  @ApiOperation({ summary: 'Revoke all user sessions' })
  @ApiOkResponse({ description: 'All user sessions revoked successfully' })
  async revokeAllSessions(
    @Param() { userId }: UserIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.revokeAllUserSessions(userId, user.id),
      message: 'All user sessions revoked successfully',
    })
  }

  @Delete(':userId')
  @Auth(Role.UserManager)
  @ApiOperation({ summary: 'Soft-delete user' })
  @ApiOkResponse({ description: 'User deleted successfully', type: UserResponseDto })
  async remove(@Param() { userId }: UserIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateUserForAdmin(userId, {
        isDeleted: true,
        deletedById: user.id,
        deletedAt: new Date(),
      }),
      message: 'User deleted successfully',
    })
  }
}
