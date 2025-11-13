import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class UpdateEmailDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({ description: 'Email address of the user' })
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string
}
