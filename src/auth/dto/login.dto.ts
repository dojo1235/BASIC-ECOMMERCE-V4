import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

export class LoginDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'Email address of the user' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ description: 'Password of the user' })
  password: string
}
