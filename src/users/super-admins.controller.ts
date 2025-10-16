import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { Role } from 'src/users/entities/user.entity'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { User } from 'src/users/entities/user.entity'
import { UserResponseDto } from './dto/user-response.dto'
import { UsersListResponseDto } from './dto/users-list-response.dto'

@ApiBearerAuth()
@Controller('admins/super')
export class SuperAdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Create new admin
  @Auth(Role.SuperAdmin)
  @ApiCreatedResponse({ description: 'Admin created successfully', type: UserResponseDto })
  async create(@Body() createAdminDto: CreateAdminDto, @CurrentUser() user) {
    return {
      data: await this.usersService.createAdmin(createAdminDto, user.id),
      message: 'Admin created successfully',
    }
  }

  @Get() // Fetch all admins
  @Auth(Role.SuperAdmin)
  @ApiOkResponse({ description: 'Admins fetched successfully', type: UsersListResponseDto })
  async findAll(@Query() query: FindUsersDto) {
    return {
      data: await this.usersService.findAllAdmins(query),
      message: 'Admins fetched successfully',
    }
  }

  @Get(':adminId') // Fetch a single admin
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiOkResponse({ description: 'Admin fetched successfully', type: UserResponseDto })
  async findOne(@Param('adminId', ParseIntPipe) adminId: number) {
    return {
      data: await this.usersService.findOneAdmin(adminId),
      message: 'Admin fetched successfully',
    }
  }

  @Patch(':adminId') // Update admin
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiOkResponse({ description: 'Admin updated successfully', type: UserResponseDto })
  async update(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @CurrentUser() user,
  ) {
    return {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        ...updateAdminDto,
        updatedBy: user.id,
        updatedAt: new Date(),
      }),
      message: 'Admin updated successfully',
    }
  }

  @Patch(':adminId/role') // Update admin role
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiOkResponse({ description: 'Admin role updated successfully', type: UserResponseDto })
  async updateRole(
    @Param('adminId', ParseIntPipe) adminId: number,
    @Body() { role }: UpdateUserRoleDto,
    @CurrentUser() user,
  ) {
    return {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        role,
        updatedBy: user.id,
        updatedAt: new Date(),
      }),
      message: 'Admin role updated successfully',
    }
  }

  @Patch(':adminId/ban') // Ban admin
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiOkResponse({ description: 'Admin banned successfully', type: UserResponseDto })
  async ban(@Param('adminId', ParseIntPipe) adminId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        isBanned: true,
        bannedBy: user.id,
        bannedAt: new Date(),
      }),
      message: 'Admin banned successfully',
    }
  }

  @Patch(':adminId/restore') // Restore admin
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiOkResponse({ description: 'Admin restored successfully', type: UserResponseDto })
  async restore(@Param('adminId', ParseIntPipe) adminId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        isBanned: false,
        isDeleted: false,
        restoredBy: user.id,
        restoredAt: new Date(),
      }),
      message: 'Admin restored successfully',
    }
  }

  @Patch(':adminId/revoke-sessions') // Log out admin from all devices
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiOkResponse({ description: 'All admin sessions revoked successfully' })
  async revokeAllSessions(@Param('adminId', ParseIntPipe) adminId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.revokeAllAdminSessions(adminId, user.id),
      message: 'All admin sessions revoked successfully',
    }
  }

  @Delete(':adminId') // Soft-delete admin
  @Auth(Role.SuperAdmin)
  @ApiParam({ name: 'adminId', type: Number })
  @ApiOkResponse({ description: 'Admin deleted successfully', type: UserResponseDto })
  async remove(@Param('adminId', ParseIntPipe) adminId: number, @CurrentUser() user) {
    return {
      data: await this.usersService.updateAdminForSuperAdmin(adminId, {
        isDeleted: true,
        deletedBy: user.id,
        deletedAt: new Date(),
      }),
      message: 'Admin deleted successfully',
    }
  }
}