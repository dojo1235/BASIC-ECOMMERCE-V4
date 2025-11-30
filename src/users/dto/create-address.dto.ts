import {
  IsString,
  IsOptional,
  Length,
  IsBoolean,
  IsPhoneNumber,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateAddressDto {
  @Length(3, 255)
  @IsString()
  @ApiProperty({ description: 'Primary address line' })
  addressLine1: string

  @IsOptional()
  @Length(3, 255)
  @IsString()
  @ApiPropertyOptional({ description: 'Secondary address line' })
  addressLine2?: string

  @IsNotEmpty()
  @IsPhoneNumber(undefined)
  @ApiProperty({ description: 'Contact number for this address' })
  contact: string

  @Length(2, 100)
  @IsString()
  @ApiProperty({ description: 'City for the address' })
  city: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Country ID of the address',
  })
  countryId: number

  @IsOptional()
  @Length(2, 20)
  @IsString()
  @ApiPropertyOptional({ description: 'Postal code' })
  postalCode?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Indicates if this is the default address' })
  isDefault?: boolean
}
