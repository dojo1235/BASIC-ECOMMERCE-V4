import { IsString, IsOptional, Length, IsBoolean, IsPhoneNumber } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateAddressDto {
  @IsString()
  @Length(3, 255)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Primary address line',
    minLength: 3,
    maxLength: 255,
    nullable: true,
  })
  addressLine1?: string

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
  @ApiPropertyOptional({ description: 'Contact number for this address', nullable: true })
  contact?: string

  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'City for the address',
    minLength: 2,
    maxLength: 100,
    nullable: true,
  })
  city?: string

  @IsString()
  @Length(2, 100)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Country for the address',
    minLength: 2,
    maxLength: 100,
    nullable: true,
  })
  country?: string

  @IsString()
  @Length(2, 20)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Postal code', minLength: 2, maxLength: 20, nullable: true })
  postalCode?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Indicates if this is the default address', nullable: true })
  isDefault?: boolean
}
