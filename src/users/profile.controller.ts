import { Controller, Post, Get, Patch, Body, HttpStatus } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/common/decorators/api-success-response.decorator'
import { Auth } from 'src/common/decorators/auth.decorator'
import { CurrentUser, type CurrentUserPayload } from 'src/common/decorators/current-user.decorator'
import { UsersService } from './users.service'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ProfileResponseDto } from './dto/profile-response.dto'

@Auth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user profile' })
  @ApiSuccessResponse({
    description: 'Profile created successfully',
    type: ProfileResponseDto,
    status: HttpStatus.CREATED,
  })
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ProfileResponseDto> {
    return await this.usersService.createProfile({ ...createProfileDto, userId: user.id })
  }

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiSuccessResponse({
    description: 'Profile fetched successfully',
    type: ProfileResponseDto,
  })
  async getProfile(@CurrentUser() user: CurrentUserPayload): Promise<ProfileResponseDto> {
    return await this.usersService.findProfile(user.id)
  }

  @Patch()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiSuccessResponse({
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<ProfileResponseDto> {
    return await this.usersService.updateProfile(user.id, updateProfileDto)
  }
}
