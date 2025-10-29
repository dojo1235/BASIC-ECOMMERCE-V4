import { Controller, Get, Patch, Body } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UserResponseDto } from './dto/user-response.dto'
import { Role } from 'src/users/entities/user.entity'

@Auth(Role.ViewOnlyAdmin)
@Controller('admins/me')
export class AdminsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch admin profile' })
  @ApiSuccessResponse({ description: 'Profile fetched successfully', type: UserResponseDto })
  async findAdminProfile(@CurrentUser() user: CurrentUserPayload): Promise<UserResponseDto> {
    return await this.usersService.findOneAdmin(user.id)
  }

  @Patch()
  @ApiOperation({ summary: 'Update admin profile' })
  @ApiSuccessResponse({ description: 'Profile updated successfully', type: UserResponseDto })
  async updateAdminProfile(
    @Body() dto: UpdateAdminDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateAdmin(user.id, {
      ...dto,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update admin password' })
  @ApiSuccessResponse({ description: 'Password updated successfully' })
  async updateAdminPassword(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    return await this.usersService.updatePassword(user.id, dto)
  }
}
