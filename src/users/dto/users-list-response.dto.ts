import { ApiProperty } from '@nestjs/swagger'
import { UserResponseDto } from './user-response.dto'
import { MetaResponseDto } from 'src/common/dto/meta-response.dto'

export class UsersListResponseDto {
  @ApiProperty({ description: 'List of users', type: [UserResponseDto] })
  users: UserResponseDto[]

  @ApiProperty({ description: 'Pagination metadata', type: MetaResponseDto })
  meta: MetaResponseDto
}
