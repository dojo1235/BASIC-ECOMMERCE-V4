import { ApiProperty } from '@nestjs/swagger'
import { BrandAuthorization } from 'src/products/entities/brand-authorization.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class BrandAuthorizationsListResponseDto {
  @ApiProperty({
    description: 'List of brand authorizations',
    type: [BrandAuthorization],
  })
  brandAuthorizations: BrandAuthorization[]

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaResponseDto,
  })
  meta: MetaResponseDto
}
