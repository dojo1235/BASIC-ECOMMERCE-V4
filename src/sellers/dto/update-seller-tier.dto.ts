import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { PremiumTier } from '../entities/seller.entity'

export class UpdateSellerTierDto {
  @IsEnum(PremiumTier)
  @ApiProperty({ description: 'Seller Premium tier' })
  premiumTier: PremiumTier
}
