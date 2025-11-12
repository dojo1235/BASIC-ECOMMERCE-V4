import { IsEnum, IsOptional, IsString, IsDateString, Length, IsPhoneNumber } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '../entities/profile.entity'

export class UpdateProfileDto {
  @IsString()
  @Length(3, 50, { message: 'First Name must be between 3 and 50 characters long' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'First name of the user',
    minLength: 3,
    maxLength: 50,
    nullable: true,
  })
  firstName?: string

  @IsString()
  @Length(3, 50, { message: 'Middle Name must be between 3 and 50 characters long' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Middle name of the user',
    minLength: 3,
    maxLength: 50,
    nullable: true,
  })
  middleName?: string

  @IsString()
  @Length(3, 50, { message: 'Last Name must be between 3 and 50 characters long' })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Last name of the user',
    minLength: 3,
    maxLength: 50,
    nullable: true,
  })
  lastName?: string

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Date of birth of the user',
    type: String,
    format: 'date',
    nullable: true,
  })
  dob?: string

  @IsPhoneNumber(undefined)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Primary contact number', nullable: true })
  contact?: string

  @IsEnum(Gender)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Gender of the user', enum: Gender, nullable: true })
  gender?: Gender

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Profile picture URL or path', nullable: true })
  profilePicture?: string
}
