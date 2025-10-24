import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { Role } from 'src/users/entities/user.entity'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserResponseDto } from './dto/user-response.dto'
import { UsersListResponseDto } from './dto/users-list-response.dto'
import { AdminIdParamDto } from 'src/common/dto/admin-id-param.dto'
import { plainToInstance } from 'class-transformer'

@Auth(Role.SuperAdmin)
@Controller('admins/super')
export class SuperAdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new admin' })
  @ApiCreatedResponse({ description: 'Admin created successfully', type: UserResponseDto })
  async create(@Body() createAdminDto: CreateAdminDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.createAdmin(createAdminDto, user.id),
      message: 'Admin created successfully',
    })
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all admins' })
  @ApiOkResponse({ description: 'Admins fetched successfully', type: UsersListResponseDto })
  async findAll(@Query() query: FindUsersDto) {
    return plainToInstance(UsersListResponseDto, {
      data: await this.usersService.findAllAdmins(query),
      message: 'Admins fetched successfully',
    })
  }

  @Get(':adminId')
  @ApiOperation({ summary: 'Fetch a single admin' })
  @ApiOkResponse({ description: 'Admin fetched successfully', type: UserResponseDto })
  async findOne(@Param() { adminId }: AdminIdParamDto) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.findOneAdmin(adminId),
      message: 'Admin fetched successfully',
    })
  }

  @Patch(':adminId')
  @ApiOperation({ summary: 'Update admin details' })
  @ApiOkResponse({ description: 'Admin updated successfully', type: UserResponseDto })
  async update(
    @Param() { adminId }: AdminIdParamDto,
    @Body() updateAdminDto: UpdateAdminDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        ...updateAdminDto,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Admin updated successfully',
    })
  }

  @Patch(':adminId/role')
  @ApiOperation({ summary: 'Update admin role' })
  @ApiOkResponse({ description: 'Admin role updated successfully', type: UserResponseDto })
  async updateRole(
    @Param() { adminId }: AdminIdParamDto,
    @Body() { role }: UpdateUserRoleDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        role,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Admin role updated successfully',
    })
  }

  @Patch(':adminId/ban')
  @ApiOperation({ summary: 'Ban admin' })
  @ApiOkResponse({ description: 'Admin banned successfully', type: UserResponseDto })
  async ban(@Param() { adminId }: AdminIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        isBanned: true,
        bannedById: user.id,
        bannedAt: new Date(),
      }),
      message: 'Admin banned successfully',
    })
  }

  @Patch(':adminId/restore')
  @ApiOperation({ summary: 'Restore admin' })
  @ApiOkResponse({ description: 'Admin restored successfully', type: UserResponseDto })
  async restore(@Param() { adminId }: AdminIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        isBanned: false,
        isDeleted: false,
        restoredById: user.id,
        restoredAt: new Date(),
      }),
      message: 'Admin restored successfully',
    })
  }

  @Patch(':adminId/revoke-sessions')
  @ApiOperation({ summary: 'Log out admin from all devices' })
  @ApiOkResponse({ description: 'All admin sessions revoked successfully' })
  async revokeAllSessions(
    @Param() { adminId }: AdminIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.revokeAllAdminSessions(adminId, user.id),
      message: 'All admin sessions revoked successfully',
    })
  }

  @Delete(':adminId')
  @ApiOperation({ summary: 'Soft-delete admin' })
  @ApiOkResponse({ description: 'Admin deleted successfully', type: UserResponseDto })
  async remove(@Param() { adminId }: AdminIdParamDto, @CurrentUser() user: CurrentUserPayload) {
    return plainToInstance(UserResponseDto, {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        isDeleted: true,
        deletedById: user.id,
        deletedAt: new Date(),
      }),
      message: 'Admin deleted successfully',
    })
  }
}
