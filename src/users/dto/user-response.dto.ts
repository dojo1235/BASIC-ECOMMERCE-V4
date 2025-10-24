import { ApiProperty } from '@nestjs/swagger'
import { User } from '../entities/user.entity'

export class UserWrapperDto {
  @ApiProperty({
    description: 'User entity with all associated fields',
    type: () => User,
  })
  user: User
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Main response payload containing the user data',
    type: () => UserWrapperDto,
  })
  data: UserWrapperDto

  @ApiProperty({
    description: 'Descriptive message about the user response operation',
  })
  message: string
}
