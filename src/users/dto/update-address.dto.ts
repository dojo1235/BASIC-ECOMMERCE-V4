import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { CreateAddressDto } from './create-address.dto'

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiPropertyOptional({
    description: 'Primary address line',
    minLength: 3,
    maxLength: 255,
    nullable: true,
  })
  addressLine1?: string

  @ApiPropertyOptional({
    description: 'Secondary address line',
    minLength: 3,
    maxLength: 255,
    nullable: true,
  })
  addressLine2?: string

  @ApiPropertyOptional({ description: 'Contact number for this address', nullable: true })
  contact?: string

  @ApiPropertyOptional({
    description: 'City for the address',
    minLength: 2,
    maxLength: 100,
    nullable: true,
  })
  city?: string

  @ApiPropertyOptional({
    description: 'Country ID of the address',
  })
  countryId: number

  @ApiPropertyOptional({ description: 'Postal code', minLength: 2, maxLength: 20, nullable: true })
  postalCode?: string

  @ApiPropertyOptional({ description: 'Indicates if this is the default address', nullable: true })
  isDefault?: boolean
}
