import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class UpdateEmailDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }: { value: unknown }): string | undefined =>
    typeof value === 'string' ? value.trim().toLowerCase() : undefined,
  )
  @ApiProperty({ description: 'Email address of the user' })
  email: string
}
