import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateProductImageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'URL of the product image' })
  imageUrl: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Whether this image is the primary image' })
  isPrimary?: boolean
}
