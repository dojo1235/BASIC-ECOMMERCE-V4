import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateProfileDto } from './create-profile.dto'
import { Gender } from '../entities/profile.entity'

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiPropertyOptional({
    description: 'First name of the user',
    minLength: 3,
    maxLength: 50,
    nullable: true,
  })
  firstName?: string

  @ApiPropertyOptional({
    description: 'Middle name of the user',
    minLength: 3,
    maxLength: 50,
    nullable: true,
  })
  middleName?: string

  @ApiPropertyOptional({
    description: 'Last name of the user',
    minLength: 3,
    maxLength: 50,
    nullable: true,
  })
  lastName?: string

  @ApiPropertyOptional({
    description: 'Date of birth of the user',
    type: String,
    format: 'date',
    nullable: true,
  })
  dob?: string

  @ApiPropertyOptional({ description: 'Primary contact number', nullable: true })
  contact?: string

  @ApiPropertyOptional({ description: 'Gender of the user', enum: Gender, nullable: true })
  gender?: Gender

  @ApiPropertyOptional({ description: 'Profile picture URL or path', nullable: true })
  profilePicture?: string
}
