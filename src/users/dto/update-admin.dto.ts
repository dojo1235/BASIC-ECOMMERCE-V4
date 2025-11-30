import { PartialType } from '@nestjs/swagger'
import { RegisterDto } from 'src/auth/dto/register.dto'

export class UpdateAdminDto extends PartialType(RegisterDto) {}
