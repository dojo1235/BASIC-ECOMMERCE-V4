import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string
  
  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsNumber()
  price: number

  @IsNotEmpty()
  @IsString()
  image: string

  @IsNumber()
  stock: number
}