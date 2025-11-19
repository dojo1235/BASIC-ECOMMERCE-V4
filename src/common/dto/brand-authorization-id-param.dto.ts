import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class BrandAuthorizationIdParamDto {
  @ApiProperty({ description: 'ID of the brand authorization' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  brandAuthorizationId: number
}
