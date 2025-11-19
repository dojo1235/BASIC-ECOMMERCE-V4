import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the category' })
  name: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Description of the category' })
  description?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ description: 'Parent category ID for nested categories' })
  parentId?: number
}
