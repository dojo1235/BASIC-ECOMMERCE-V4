import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { Role } from '../enums/roles.enum'
import {
  sanitizeForSuperAdmin,
  sanitizeForAdmin,
  sanitizeForPublic,
} from '../utils/sanitize.util'

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (!response) return response

        const request = context.switchToHttp().getRequest()
        const role: Role | undefined = request.user?.role

        // Role-based sanitizer
        const sanitizeByRole = (data: any) => {
          if (!role) return sanitizeForPublic(data)

          switch (role) {
            case Role.SuperAdmin:
              return sanitizeForSuperAdmin(data)
            case Role.GeneralAdmin:
            case Role.ProductManager:
            case Role.OrderManager:
            case Role.UserManager:
            case Role.ViewOnlyAdmin:
              return sanitizeForAdmin(data)
            case Role.User:
            default:
              return sanitizeForPublic(data)
          }
        }

        // Sanitize the entire response object
        return sanitizeByRole(response)
      }),
    )
  }
}