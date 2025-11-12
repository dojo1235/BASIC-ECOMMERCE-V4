import {
  IsString,
  IsOptional,
  Length,
  IsBoolean,
  IsPhoneNumber,
  IsNotEmpty,
  IsInt,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { QueryBoolean } from 'src/common/decorators/query-boolean.decorator'

export class CreateAddressDto {
  @IsString()
  @Length(3, 255)
  @ApiProperty({ description: 'Primary address line', minLength: 3, maxLength: 255 })
  addressLine1: string

  @IsString()
  @Length(3, 255)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Secondary address line',
    minLength: 3,
    maxLength: 255,
    nullable: true,
  })
  addressLine2?: string

  @IsPhoneNumber(undefined)
  @IsOptional()
  @ApiProperty({ description: 'Contact number for this address', nullable: true })
  contact?: string

  @IsString()
  @Length(2, 100)
  @ApiProperty({ description: 'City for the address', minLength: 2, maxLength: 100 })
  city: string

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Country ID of the address',
  })
  countryId: number

  @IsString()
  @Length(2, 20)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Postal code', minLength: 2, maxLength: 20, nullable: true })
  postalCode?: string

  @IsOptional()
  @QueryBoolean()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Indicates if this is the default address', nullable: true })
  isDefault?: boolean
}
