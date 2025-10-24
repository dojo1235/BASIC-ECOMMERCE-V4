import { ApiProperty } from '@nestjs/swagger'

export class TokensDataDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken: string
}

export class TokensWrapperDto {
  @ApiProperty({
    description: 'Authentication tokens',
    type: () => TokensDataDto,
  })
  tokens: TokensDataDto
}

export class TokensResponseDto {
  @ApiProperty({
    description: 'Main response payload containing the tokens',
    type: () => TokensWrapperDto,
  })
  data: TokensWrapperDto

  @ApiProperty({
    description: 'Descriptive message about the tokens response operation',
  })
  message: string
}
