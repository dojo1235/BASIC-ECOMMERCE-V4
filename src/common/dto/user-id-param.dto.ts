import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export class UserIdParamDto {
  @ApiProperty({ description: 'ID of the user' })
  @IsInt()
  @Min(1)
  userId: number
}
