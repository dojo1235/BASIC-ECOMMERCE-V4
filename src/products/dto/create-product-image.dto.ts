import { IsNotEmpty, IsString, IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductImageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'URL of the product image' })
  imageUrl: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Whether this image is the primary image' })
  isPrimary: boolean
}
