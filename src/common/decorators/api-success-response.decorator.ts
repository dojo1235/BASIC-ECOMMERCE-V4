import {
  applyDecorators,
  HttpStatus,
  type Type,
  UseInterceptors,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { ApiExtraModels, ApiResponse as OriginalApiResponse, getSchemaPath } from '@nestjs/swagger'
import { plainToInstance } from 'class-transformer'
import { map } from 'rxjs/operators'

class SuccessResponse<T = any> {
  data: T

  message: string
}

@Injectable()
class ResponseInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly type: Type<T>,
    private readonly description: string,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const wrapped = { message: this.description, data: data ?? null }
        return plainToInstance(SuccessResponse, wrapped)
      }),
    )
  }
}

class EmptyResponseDto {}

export const ApiSuccessResponse = <T extends Type<any>>(options: {
  description: string
  type?: T
  status?: number
}) => {
  const { description, type = EmptyResponseDto, status = HttpStatus.OK } = options

  return applyDecorators(
    UseInterceptors(new ResponseInterceptor(type, description)),
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
