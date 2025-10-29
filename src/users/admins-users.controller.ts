import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
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

@Auth(Role.UserManager)
@Controller('admins/users')
export class AdminsUsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':userId/revoke-sessions')
  @ApiOperation({ summary: 'Log out user from all devices' })
  @ApiSuccessResponse({
    description: 'All user sessions revoked successfully',
    status: HttpStatus.NO_CONTENT,
  })
  async revokeAllSessions(
    @Param() { userId }: UserIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    await this.usersService.revokeAllUserSessions(userId, user.id)
  }

  @Get()
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiSuccessResponse({ description: 'Users fetched successfully', type: UsersListResponseDto })
  async findAllUsers(@Query() query: FindUsersDto): Promise<UsersListResponseDto> {
    return await this.usersService.findAllUsers(query)
  }

  @Get(':userId')
  @Auth(Role.ViewOnlyAdmin)
  @ApiOperation({ summary: 'Fetch a single user' })
  @ApiSuccessResponse({ description: 'User fetched successfully', type: UserResponseDto })
  async findOneUser(@Param() { userId }: UserIdParamDto): Promise<UserResponseDto> {
    return await this.usersService.findOneUser(userId)
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update user details' })
  @ApiSuccessResponse({ description: 'User updated successfully', type: UserResponseDto })
  async updateUserDetails(
    @Param() { userId }: UserIdParamDto,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUserForAdmin(userId, {
      ...updateUserDto,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':userId/role')
  @Auth(Role.SuperAdmin)
  @ApiOperation({ summary: 'Update user role' })
  @ApiSuccessResponse({ description: 'User role updated successfully', type: UserResponseDto })
  async updateUserRole(
    @Param() { userId }: UserIdParamDto,
    @Body() { role }: UpdateUserRoleDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUserForAdmin(userId, {
      role,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':userId/ban')
  @ApiOperation({ summary: 'Ban user' })
  @ApiSuccessResponse({ description: 'User banned successfully', type: UserResponseDto })
  async banUser(
    @Param() { userId }: UserIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUserForAdmin(userId, {
      isBanned: true,
      bannedById: user.id,
      bannedAt: new Date(),
    })
  }

  @Patch(':userId/restore')
  @ApiOperation({ summary: 'Restore user' })
  @ApiSuccessResponse({ description: 'User restored successfully', type: UserResponseDto })
  async restoreUser(
    @Param() { userId }: UserIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUserForAdmin(userId, {
      isBanned: false,
      isDeleted: false,
      restoredById: user.id,
      restoredAt: new Date(),
    })
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Soft-delete user' })
  @ApiSuccessResponse({ description: 'User deleted successfully', type: UserResponseDto })
  async deleteUser(
    @Param() { userId }: UserIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUserForAdmin(userId, {
      isDeleted: true,
      deletedById: user.id,
      deletedAt: new Date(),
    })
  }
}
