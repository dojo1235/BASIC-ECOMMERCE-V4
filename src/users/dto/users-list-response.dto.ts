import { ApiProperty } from '@nestjs/swagger'
import { User } from '../entities/user.entity'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class UsersListDataDto {
  @ApiProperty({
    description: 'Array of user entities with their full details',
    type: () => [User],
  })
  users: User[]

  @ApiProperty({
    description: 'Pagination metadata',
    type: MetaResponseDto,
  })
  meta: MetaResponseDto
}

export class UsersListResponseDto {
  @ApiProperty({
    description: 'Main response payload containing the users list and pagination metadata',
    type: () => UsersListDataDto,
  })
  data: UsersListDataDto

  @ApiProperty({
    description: 'Descriptive message about the users list response operation',
  })
  message: string
}
