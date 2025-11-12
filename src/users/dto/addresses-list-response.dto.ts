import { ApiProperty } from '@nestjs/swagger'
import { Address } from '../entities/address.entity'

export class AddressesListResponseDto {
  @ApiProperty({
    description: 'List of addresses a user has',
    type: [Address],
  })
  addresses: Address[]
}
