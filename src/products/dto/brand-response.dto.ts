import { ApiProperty } from '@nestjs/swagger'
import { Brand } from '../entities/brand.entity'

export class BrandResponseDto {
  @ApiProperty({ description: 'Brand details', type: () => Brand, nullable: true })
  brand: Brand | null
}
