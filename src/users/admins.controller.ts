import { Controller, Get, Patch, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { Role } from 'src/users/entities/user.entity'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserResponseDto } from './dto/user-response.dto'

@ApiBearerAuth()
@Controller('admins/me')
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // Fetch admin profile
  @Auth(Role.ViewOnlyAdmin)
  @ApiOkResponse({ description: 'Profile fetched successfully', type: UserResponseDto })
  async findOne(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.usersService.findOneAdmin(user.id),
      message: 'Profile fetched successfully',
    }
  }

  @Patch() // Update admin profile
  @Auth(Role.ViewOnlyAdmin)
  @ApiOkResponse({ description: 'Profile updated successfully', type: UserResponseDto })
  async update(@Body() dto: UpdateAdminDto, @CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.usersService.updateAdmin(user.id, {
        ...dto,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Profile updated successfully',
    }
  }

  @Patch('password') // Update password
  @Auth(Role.ViewOnlyAdmin)
  @ApiOkResponse({ description: 'Password updated successfully' })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return {
      data: await this.usersService.updatePassword(user.id, updatePasswordDto),
      message: 'Password updated successfully',
    }
  }
}
