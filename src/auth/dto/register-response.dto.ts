import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { UserResponseDto } from 'src/users/dto/user-response.dto'
import { TokensResponseDto } from './tokens-response.dto'

export class RegisterResponseDto {
  @Type(() => UserResponseDto)
  @ApiProperty({ description: 'Registered user details', type: () => UserResponseDto })
  user: UserResponseDto

  @ApiProperty({ description: 'Authentication tokens', type: () => TokensResponseDto })
  tokens: TokensResponseDto
}
