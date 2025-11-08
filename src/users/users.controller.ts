import { Controller, Get, Patch, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
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

  @Patch()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiSuccessResponse({ description: 'Profile updated successfully', type: UserResponseDto })
  async updateUserProfile(
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<UserResponseDto> {
    return await this.usersService.updateUser(user.id, {
      ...dto,
      updatedById: user.id,
      updatedAt: new Date(),
    })
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('password')
  @ApiOperation({ summary: 'Update user password' })
  @ApiSuccessResponse({
    description: 'Password updated successfully',
    status: HttpStatus.NO_CONTENT,
  })
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<void> {
    await this.usersService.updatePassword(user.id, dto)
  }

  @Delete()
  @ApiOperation({ summary: 'Soft-delete user account' })
  @ApiSuccessResponse({ description: 'Account deleted successfully', type: UserResponseDto })
  async deleteUser(@CurrentUser() user: CurrentUserPayload): Promise<UserResponseDto> {
    return await this.usersService.updateUser(user.id, {
      isDeleted: true,
      deletedById: user.id,
      deletedAt: new Date(),
    })
  }
}
