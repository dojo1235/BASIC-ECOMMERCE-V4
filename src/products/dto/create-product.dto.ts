import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Product name' })
  name: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Product description' })
  description: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'Product price' })
  price: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Product image URL' })
  image: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ description: 'Available stock quantity' })
  stock: number
}