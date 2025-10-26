import { applyDecorators, HttpStatus, Type } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiResponse as OriginalApiResponse,
  getSchemaPath,
  ApiProperty,
} from '@nestjs/swagger'

export class SuccessResponse<T = any> {
  @ApiProperty()
  data: T

  @ApiProperty()
  message: string
}

export const ApiSuccessResponse = <T extends Type<any>>(options: {
  description: string
  type: T
  status?: number
}) => {
  const { type, description, status = HttpStatus.OK } = options

  return applyDecorators(
    ApiExtraModels(SuccessResponse, type),
    OriginalApiResponse({
      status,
      description: description ?? 'Successful response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: {
              data: { $ref: getSchemaPath(type) },
            },
          },
        ],
      },
    }),
  )
}
