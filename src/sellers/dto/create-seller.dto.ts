import { IsString, IsOptional, IsInt, IsNotEmpty, Length, IsPhoneNumber } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSellerDto {
  @IsString()
  @Length(3, 100)
  @ApiProperty({ description: 'Store name' })
  storeName: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Store description' })
  storeDescription?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Store logo URL' })
  logoUrl?: string

  @IsPhoneNumber(undefined)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Contact number for this store' })
  storePhone?: string

  @IsString()
  @ApiProperty({ description: 'Store address' })
  storeAddress: string

  @IsString()
  @ApiProperty({ description: 'Store city' })
  storeCity: string

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Store country ID',
  })
  storeCountryId: number
}
