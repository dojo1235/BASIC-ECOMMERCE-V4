import { Controller, Get, Body, Patch, Delete, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { Auth } from 'src/common/decorators/auth.decorator'
import { buildResponse } from 'src/common/utils/response.util'

@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Fetch user profile
  @Get()
  @Auth()
  async findOne(@Req() req: any) {
    return buildResponse(
      await this.usersService.findOneUser(req.user.id),
      'Profile fetched successfully',
    )
  }

  // Update user profile
  @Patch()
  @Auth()
  async update(@Body() dto: UpdateUserDto, @Req() req: any) {
    return buildResponse(
      await this.usersService.updateUser(req.user.id, {
        ...dto,
        updatedBy: req.user.id,
        updatedAt: new Date(),
      }),
      'Profile updated successfully',
    )
  }
  
  // Update password for user
  @Patch('password')
  @Auth()
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

  // Soft-delete user
  @Delete()
  @Auth()
  async remove(@Req() req: any) {
    return buildResponse(
      await this.usersService.updateUser(req.user.id, {
        isDeleted: true,
        deletedBy: req.user.id,
        deletedAt: new Date(),
      }),
      'Account deleted successfully',
    )
  }
}