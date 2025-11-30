import { ApiProperty } from '@nestjs/swagger'
import { Address } from '../entities/address.entity'

export class AddressResponseDto {
  @ApiProperty({
    description: 'User address',
    type: () => Address,
    nullable: true,
  })
  address: Address | null
}
