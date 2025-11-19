import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @ApiProperty({ description: 'Email address of the user' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @ApiProperty({ description: 'Password of the user' })
  password: string
}
