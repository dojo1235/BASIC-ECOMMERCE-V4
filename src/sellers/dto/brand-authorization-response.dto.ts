import { ApiProperty } from '@nestjs/swagger'
import { BrandAuthorization } from 'src/products/entities/brand-authorization.entity'

export class BrandAuthorizationResponseDto {
  @ApiProperty({
    description: 'Brand authorization details',
    type: () => BrandAuthorization,
    nullable: true,
  })
  brandAuthorization: BrandAuthorization | null
}
