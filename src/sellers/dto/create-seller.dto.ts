import {
  IsString,
  IsOptional,
  IsInt,
  IsNotEmpty,
  Length,
  IsPhoneNumber,
  Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSellerDto {
  @Length(3, 100)
  @IsString()
  @ApiProperty({ description: 'Store name' })
  storeName: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Store description' })
  storeDescription?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Store logo URL' })
  logoUrl?: string

  @IsOptional()
  @IsPhoneNumber(undefined)
  @ApiPropertyOptional({ description: 'Contact number for this store' })
  storePhone?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Store address' })
  storeAddress: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Store city' })
  storeCity: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Store country ID',
  })
  storeCountryId: number
}
