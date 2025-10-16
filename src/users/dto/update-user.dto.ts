import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { RegisterDto } from 'src/auth/dto/register.dto'

export class UpdateUserDto extends PartialType(RegisterDto) {
  @ApiPropertyOptional({ description: 'Full name of the user' })
  name?: string

  @ApiPropertyOptional({ description: 'Email address of the user' })
  email?: string

  @ApiPropertyOptional({ description: 'Password of the user' })
  password?: string
}