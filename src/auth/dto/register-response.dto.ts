import { ApiProperty } from '@nestjs/swagger'
import { User } from 'src/users/entities/user.entity'
import { TokensDataDto } from './tokens-response.dto'

export class RegisterDataDto {
  @ApiProperty({ description: 'Registered user details', type: () => User })
  user: User

  @ApiProperty({ description: 'Authentication tokens', type: () => TokensDataDto })
  tokens: TokensDataDto
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Main response payload containing the register response',
    type: () => RegisterDataDto,
  })
  data: RegisterDataDto

  @ApiProperty({
    description: 'Descriptive message about the register response operation',
  })
  message: string
}
