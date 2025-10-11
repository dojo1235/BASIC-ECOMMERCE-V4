import { Controller, Get, Patch, Body, Req } from '@nestjs/common'
import { UsersService } from './users.service';
import { UpdateAdminDto } from './dto/update-admin.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { Role } from 'src/common/enums/roles.enum'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('admins/me')
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  // Fetch admin profile
  @Get()
  @Auth(Role.ViewOnlyAdmin)
  async findOne(@Req() req: any) {
    return buildResponse(
      await this.usersService.findOneAdmin(req.user.id),
      'Profile fetched successfully',
    )
  }

  // Update admin profile
  @Patch()
  @Auth(Role.ViewOnlyAdmin)
  async update(@Body() dto: UpdateAdminDto,
    @Req() req: any) {
    return buildResponse(
      await this.usersService.updateAdmin(req.user.id, {
        ...dto,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'Profile updated successfully',
    )
  }
  
  // Update password for admin
  @Patch('password')
  @Auth(Role.ViewOnlyAdmin)
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: any,
  ) {
    return buildResponse(
      await this.usersService.updatePassword(
        req.user.id,
        updatePasswordDto
      ),
      'Password updated successfully',
    )
  }
}