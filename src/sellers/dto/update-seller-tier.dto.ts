import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PremiumTier } from '../entities/seller.entity'

export class UpdateSellerTierDto {
  @IsNotEmpty()
  @IsEnum(PremiumTier)
  @ApiProperty({ description: 'Seller Premium tier', enum: PremiumTier })
  premiumTier: PremiumTier
}
