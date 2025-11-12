import { ApiProperty } from '@nestjs/swagger'
import { Address } from '../entities/address.entity'

export class AddressesListResponseDto {
  @ApiProperty({
    description: 'List of addresses a user have',
    type: [Address],
  })
  addresses: Address[]
}
