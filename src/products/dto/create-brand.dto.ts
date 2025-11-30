import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the brand' })
  name: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Description of the brand' })
  description?: string
}
