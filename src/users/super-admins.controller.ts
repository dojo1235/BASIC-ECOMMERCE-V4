import { Controller, Get, Post, Patch, Delete, Body,
Param, ParseIntPipe, Query, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { Role } from 'src/common/enums/roles.enum'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('admins/super')
export class SuperAdminsController {
  constructor(private readonly usersService: UsersService) {}

  // Create new admin
  @Post()
  @Auth(Role.SuperAdmin)
  async create(@Body() createAdminDto: CreateAdminDto, @Req() req: any) {
    return buildResponse(
      await this.usersService.createAdmin(createAdminDto, req.user.id),
      'Admin created successfully',
    )
  }

  // Fetch all admins
  @Get()
  @Auth(Role.SuperAdmin)
  async findAll(@Query() query: Record<string, any>) {
    return buildResponse(
      await this.usersService.findAllAdmins(query),
      'Admins fetched successfully',
    )
  }

  // Fetch a single admin
  @Get(':id')
  @Auth(Role.SuperAdmin)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return buildResponse(
      await this.usersService.findOneAdmin(id),
      'Admin fetched successfully',
    )
  }

  // Update admin
  @Patch(':id')
  @Auth(Role.SuperAdmin)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminDto,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.usersService.updateAdminForSuperAdmin(id, {
        ...dto,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'Admin updated successfully',
    )
  }

  // Update admin role
  @Patch(':id/role')
  @Auth(Role.SuperAdmin)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.usersService.updateAdminForSuperAdmin(id, {
        role,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'Admin role updated successfully',
    )
  }

  // Ban admin
  @Patch(':id/ban')
  @Auth(Role.SuperAdmin)
  async ban(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.updateAdminForSuperAdmin(id, {
        isBanned: true,
        bannedBy: req.user.id,
        bannedAt: new Date(),
      }),
      'Admin banned successfully',
    )
  }

  // Restore admin
  @Patch(':id/restore')
  @Auth(Role.SuperAdmin)
  async restore(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.updateAdminForSuperAdmin(id, {
        isBanned: false,
        isDeleted: false,
        restoredBy: req.user.id,
        restoredAt: new Date(),
      }),
      'Admin restored successfully',
    )
  }

  // Log out admin from all devices
  @Patch(':id/revoke-sessions')
  @Auth(Role.SuperAdmin)
  async revokeAllSessions(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.revokeAllAdminSessions(id, req.user.id),
      'All admin sessions revoked successfully',
    )
  }

  // Soft-delete admin
  @Delete(':id')
  @Auth(Role.SuperAdmin)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.updateAdminForSuperAdmin(id, {
        isDeleted: true,
        deletedBy: req.user.id,
        deletedAt: new Date(),
      }),
      'Admin deleted successfully',
    )
  }
}