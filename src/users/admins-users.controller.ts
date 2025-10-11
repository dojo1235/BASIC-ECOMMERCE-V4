import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { Role } from 'src/common/enums/roles.enum'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('admins/users')
export class AdminsUsersController {
  constructor(private readonly usersService: UsersService) {}

  // Fetch all users
  @Get()
  @Auth(Role.ViewOnlyAdmin)
  async findAll(@Query() query: Record<string, any>) {
    return buildResponse(
      await this.usersService.findAllUsers(query),
      'Users fetched successfully',
    )
  }

  // Fetch a single user
  @Get(':id')
  @Auth(Role.ViewOnlyAdmin)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return buildResponse(
      await this.usersService.findOneUser(id),
      'User fetched successfully',
    )
  }

  // Update user
  @Patch(':id')
  @Auth(Role.UserManager)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.usersService.updateUserForAdmin(id, {
        ...dto,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'User updated successfully',
    )
  }

  // Update user role
  @Patch(':id/role')
  @Auth(Role.SuperAdmin)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.usersService.updateUserForAdmin(id, {
        role,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'User role updated successfully',
    )
  }

  // Ban user
  @Patch(':id/ban')
  @Auth(Role.UserManager)
  async ban(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.updateUserForAdmin(id, {
        isBanned: true,
        bannedBy: req.user.id,
        bannedAt: new Date(),
      }),
      'User banned successfully',
    )
  }

  // Restore user
  @Patch(':id/restore')
  @Auth(Role.UserManager)
  async restore(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.updateUserForAdmin(id, {
        isBanned: false,
        isDeleted: false,
        restoredBy: req.user.id,
        restoredAt: new Date(),
      }),
      'User restored successfully',
    )
  }
  
  // Log out user from all devices
  @Patch(':id/revoke-sessions')
  @Auth(Role.UserManager)
  async revokeAllSessions(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.revokeAllUserSessions(id, req.user.id),
      'All user sessions revoked successfully',
    )
  }

  // Soft-delete user
  @Delete(':id')
  @Auth(Role.UserManager)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return buildResponse(
      await this.usersService.updateUserForAdmin(id, {
        isDeleted: true,
        deletedBy: req.user.id,
        deletedAt: new Date(),
      }),
      'User deleted successfully',
    )
  }
}