import { Controller, Get, Patch, Body } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { UpdateEmailDto } from './dto/update-email.dto'
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

  @Patch('email')
  @ApiOperation({ summary: 'Update admin email' })
  @ApiSuccessResponse({ description: 'Email updated successfully', type: UserResponseDto })
  async updateAdminProfile(
    @Body() updateEmailDto: UpdateEmailDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateEmail(user.id, updateEmailDto)
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update admin password' })
  @ApiSuccessResponse({
    description: 'Password updated successfully',
  })
  async updateAdminPassword(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    await this.usersService.updatePassword(user.id, dto)
  }
}
