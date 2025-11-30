import { Controller, Get, Patch, Delete, Body } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { UpdateEmailDto } from './dto/update-email.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UserResponseDto } from './dto/user-response.dto'

@Auth()
@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch user profile' })
  @ApiSuccessResponse({ description: 'Profile fetched successfully', type: UserResponseDto })
  async findUserProfile(@CurrentUser() user: CurrentUserPayload): Promise<UserResponseDto> {
    return await this.usersService.findOneUser(user.id)
  }

  @Patch('email')
  @ApiOperation({ summary: 'Update user email' })
  @ApiSuccessResponse({ description: 'Email updated successfully', type: UserResponseDto })
  async updateUserProfile(
    @Body() updateEmailDto: UpdateEmailDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateEmail(user.id, updateEmailDto)
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiSuccessResponse({
    description: 'Password updated successfully',
  })
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    await this.usersService.updatePassword(user.id, dto)
  }

  @Delete()
  @ApiOperation({ summary: 'Soft-delete user account' })
  @ApiSuccessResponse({ description: 'Account deleted successfully' })
  async deleteUser(@CurrentUser() user: CurrentUserPayload): Promise<void> {
    await this.usersService.deleteUserAccount(user.id)
  }
}
