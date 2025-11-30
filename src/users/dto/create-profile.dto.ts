import { IsEnum, IsOptional, IsString, IsDateString, Length, IsPhoneNumber } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '../entities/profile.entity'

export class CreateProfileDto {
  @Length(3, 50, { message: 'First Name must be between 3 and 50 characters long' })
  @IsString()
  @ApiProperty({ description: 'First name of the user' })
  firstName: string

  @IsOptional()
  @Length(3, 50, { message: 'Middle Name must be between 3 and 50 characters long' })
  @IsString()
  @ApiPropertyOptional({ description: 'Middle name of the user' })
  middleName?: string

  @Length(3, 50, { message: 'Last Name must be between 3 and 50 characters long' })
  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  lastName: string

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date of birth of the user' })
  dob?: string

  @IsOptional()
  @IsPhoneNumber(undefined)
  @ApiPropertyOptional({ description: 'Primary contact number' })
  contact?: string

  @IsOptional()
  @IsEnum(Gender)
  @ApiPropertyOptional({ description: 'Gender of the user', enum: Gender })
  gender?: Gender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Profile picture URL or path' })
  profilePicture?: string
}
