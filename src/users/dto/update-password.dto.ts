import { IsString, IsNotEmpty, Length, Matches } from 'class-validator'

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Old password is required' })
  @Length(8, 100, { message: 'Old password must be between 8 and 100 characters long' })
  @Matches(/[A-Z]/, { message: 'Old password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'Old password must contain at least one lowercase letter' })
  @Matches(/\d/, { message: 'Old password must contain at least one number' })
  @Matches(/[\W_]/, { message: 'Old password must contain at least one special character' })
  oldPassword: string

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @Length(8, 100, { message: 'New password must be between 8 and 100 characters long' })
  @Matches(/[A-Z]/, { message: 'New password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'New password must contain at least one lowercase letter' })
  @Matches(/\d/, { message: 'New password must contain at least one number' })
  @Matches(/[\W_]/, { message: 'New password must contain at least one special character' })
  newPassword: string
}