import { ApiProperty } from '@nestjs/swagger'
import { Profile } from '../entities/profile.entity'

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User profile',
    type: () => Profile,
    nullable: true,
  })
  profile: Profile | null
}
