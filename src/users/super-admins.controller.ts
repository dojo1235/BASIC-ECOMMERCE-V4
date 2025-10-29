import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { UpdateUserRoleDto } from './dto/update-user-role.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { UsersListResponseDto } from './dto/users-list-response.dto'
import { AdminIdParamDto } from 'src/common/dto/admin-id-param.dto'
import { Role } from 'src/users/entities/user.entity'

@Auth(Role.SuperAdmin)
@Controller('admins/super')
export class SuperAdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new admin' })
  @ApiSuccessResponse({
    description: 'Admin created successfully',
    type: UserResponseDto,
    status: HttpStatus.CREATED,
  })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.createAdmin(createAdminDto, user.id)
  }

  @Post(':adminId/revoke-sessions')
  @ApiOperation({ summary: 'Log out admin from all devices' })
  @ApiSuccessResponse({
    description: 'All admin sessions revoked successfully',
    status: HttpStatus.CREATED,
  })
  async revokeAllSessions(
    @Param() { adminId }: AdminIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return await this.usersService.revokeAllAdminSessions(adminId, user.id)
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all admins' })
  @ApiSuccessResponse({ description: 'Admins fetched successfully', type: UsersListResponseDto })
  async findAllAdmins(@Query() query: FindUsersDto): Promise<UsersListResponseDto> {
    return await this.usersService.findAllAdmins(query)
  }

  @Get(':adminId')
  @ApiOperation({ summary: 'Fetch a single admin' })
  @ApiSuccessResponse({ description: 'Admin fetched successfully', type: UserResponseDto })
  async findOneAdmin(@Param() { adminId }: AdminIdParamDto): Promise<UserResponseDto> {
    return await this.usersService.findOneAdmin(adminId)
  }

  @Patch(':adminId')
  @ApiOperation({ summary: 'Update admin details' })
  @ApiSuccessResponse({ description: 'Admin updated successfully', type: UserResponseDto })
  async updateAdminDetails(
    @Param() { adminId }: AdminIdParamDto,
    @Body() updateAdminDto: UpdateAdminDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateAdminForSuperAdmin(adminId, {
      ...updateAdminDto,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':adminId/role')
  @ApiOperation({ summary: 'Update admin role' })
  @ApiSuccessResponse({ description: 'Admin role updated successfully', type: UserResponseDto })
  async updateAdminRole(
    @Param() { adminId }: AdminIdParamDto,
    @Body() { role }: UpdateUserRoleDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateAdminForSuperAdmin(adminId, {
      role,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch(':adminId/ban')
  @ApiOperation({ summary: 'Ban admin' })
  @ApiSuccessResponse({ description: 'Admin banned successfully', type: UserResponseDto })
  async banAdmin(
    @Param() { adminId }: AdminIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateAdminForSuperAdmin(adminId, {
      isBanned: true,
      bannedById: user.id,
      bannedAt: new Date(),
    })
  }

  @Patch(':adminId/restore')
  @ApiOperation({ summary: 'Restore admin' })
  @ApiSuccessResponse({ description: 'Admin restored successfully', type: UserResponseDto })
  async restoreAdmin(
    @Param() { adminId }: AdminIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateAdminForSuperAdmin(adminId, {
      isBanned: false,
      isDeleted: false,
      restoredById: user.id,
      restoredAt: new Date(),
    })
  }

  @Delete(':adminId')
  @ApiOperation({ summary: 'Soft-delete admin' })
  @ApiSuccessResponse({ description: 'Admin deleted successfully', type: UserResponseDto })
  async deleteAdmin(
    @Param() { adminId }: AdminIdParamDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateAdminForSuperAdmin(adminId, {
      isDeleted: true,
      deletedById: user.id,
      deletedAt: new Date(),
    })
  }
}
