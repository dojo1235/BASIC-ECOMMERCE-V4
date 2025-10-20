import { Controller, Get, Patch, Delete, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UserResponseDto } from './dto/user-response.dto'

@ApiBearerAuth()
@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // Fetch user profile
  @Auth()
  @ApiOkResponse({ description: 'Profile fetched successfully', type: UserResponseDto })
  async findOne(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.usersService.findOneUser(user.id),
      message: 'Profile fetched successfully',
    }
  }

  @Patch() // Update user profile
  @Auth()
  @ApiOkResponse({ description: 'Profile updated successfully', type: UserResponseDto })
  async update(@Body() dto: UpdateUserDto, @CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.usersService.updateUser(user.id, {
        ...dto,
        updatedById: user.id,
        updatedAt: new Date(),
      }),
      message: 'Profile updated successfully',
    }
  }

  @Patch('password') // Update password
  @Auth()
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

  @Delete() // Soft-delete user
  @Auth()
  @ApiOkResponse({ description: 'Account deleted successfully', type: UserResponseDto })
  async remove(@CurrentUser() user: CurrentUserPayload) {
    return {
      data: await this.usersService.updateUser(user.id, {
        isDeleted: true,
        deletedById: user.id,
        deletedAt: new Date(),
      }),
      message: 'Account deleted successfully',
    }
  }
}
