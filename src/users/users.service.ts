import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { User } from './entities/user.entity'
import { AuthRepository } from '../auth/auth.repository'
import { UsersRepository } from './users.repository'
import { hash, compare } from 'src/common/utils/crypto.util'
import { Role } from './entities/user.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { FindUsersDto } from './dto/find-users.dto'

type UpdateUserInput = Partial<User> & { password?: string }

@Injectable()
export class UsersService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  // Create admin (super admin)
  async createAdmin({ password, ...data }: CreateAdminDto, superAdminId: number) {
    if (data.role === Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Creating user not allowed')
    const existing = await this.usersRepository.findUserByEmail(data.email)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    const hashedPassword = await hash(password)
    const created = await this.usersRepository.createUser({
      ...data,
      passwordHash: hashedPassword,
      createdById: superAdminId,
    })
    return { user: plainToInstance(User, created) }
  }

  // Find all admins
  async findAllAdmins(query: FindUsersDto) {
    if (query.role && query.role === Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Role is not an admin')
    const { users, meta } = await this.usersRepository.findAllAdmins(query)
    return { users: plainToInstance(User, users), meta }
  }

  // Find all users
  async findAllUsers(query: FindUsersDto) {
    const { users, meta } = await this.usersRepository.findAllUsers(query)
    return { users: plainToInstance(User, users), meta }
  }

  // Find one admin
  async findOneAdmin(userId: number) {
    const admin = await this.usersRepository.findUserById(userId)
    this.ensureIsAdmin(admin)
    return { user: plainToInstance(User, admin) }
  }

  // Find one user
  async findOneUser(userId: number) {
    const user = await this.usersRepository.findUserById(userId)
    this.ensureIsUser(user)
    return { user: plainToInstance(User, user) }
  }

  // Update admin (super admin)
  async updateAdminForSuperAdmin(userId: number, { password, ...data }: UpdateUserInput) {
    const admin = await this.usersRepository.findUserById(userId)
    this.ensureIsAdmin(admin)
    if (data.email) {
      const existing = await this.usersRepository.findUserByEmail(data.email)
      if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    }
    const updatedData: Partial<User> = { ...data }
    if (password) updatedData.passwordHash = await hash(password)
    await this.usersRepository.updateUser(userId, updatedData)
    const updated = await this.usersRepository.findUserById(userId)
    return { user: plainToInstance(User, updated) }
  }

  // Update admin (admin)
  async updateAdmin(userId: number, { password, ...data }: UpdateUserInput) {
    if (password) throw new AppError(ErrorCode.INVALID_STATE, 'Use the change password endpoint')
    const admin = await this.usersRepository.findUserById(userId)
    this.ensureIsAdmin(admin)
    if (data.email) {
      const existing = await this.usersRepository.findUserByEmail(data.email)
      if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    }
    await this.usersRepository.updateUser(userId, data)
    const updated = await this.usersRepository.findUserById(userId)
    return { user: plainToInstance(User, updated) }
  }

  // Update user (admin)
  async updateUserForAdmin(userId: number, { password, ...data }: UpdateUserInput) {
    const user = await this.usersRepository.findUserById(userId)
    this.ensureIsUser(user)
    if (data.email) {
      const existing = await this.usersRepository.findUserByEmail(data.email)
      if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    }
    const updatedData: Partial<User> = { ...data }
    if (password) updatedData.passwordHash = await hash(password)
    await this.usersRepository.updateUser(userId, updatedData)
    const updated = await this.usersRepository.findUserById(userId)
    return { user: plainToInstance(User, updated) }
  }

  // Update user (user)
  async updateUser(userId: number, { password, ...data }: UpdateUserInput) {
    if (password) throw new AppError(ErrorCode.INVALID_STATE, 'Use the change password endpoint')
    const user = await this.usersRepository.findUserById(userId)
    this.ensureIsUser(user)
    if (data.email) {
      const existing = await this.usersRepository.findUserByEmail(data.email)
      if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    }
    await this.usersRepository.updateUser(userId, data)
    const updated = await this.usersRepository.findUserById(userId)
    return { user: plainToInstance(User, updated) }
  }

  // Update password
  async updatePassword(userId: number, { oldPassword, newPassword }: UpdatePasswordDto) {
    if (newPassword === oldPassword)
      throw new AppError(ErrorCode.INVALID_STATE, 'Cannot update to same password')
    const user = await this.usersRepository.findUserById(userId)
    if (!user) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    const isValid = await compare(oldPassword, user.passwordHash)
    if (!isValid) throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Old password is incorrect')
    const newHashed = await hash(newPassword)
    await this.usersRepository.updateUser(userId, {
      passwordHash: newHashed,
      updatedAt: new Date(),
    })
  }

  // Revoke all admin sessions (super admin)
  async revokeAllAdminSessions(userId: number, superAdminId: number) {
    const admin = await this.usersRepository.findUserById(userId)
    this.ensureIsAdmin(admin)
    await this.authRepository.revokeAllTokensForUser(userId, {
      revoked: true,
      revokedById: superAdminId,
      revokedAt: new Date(),
    })
  }

  // Revoke all user sessions (admin)
  async revokeAllUserSessions(userId: number, adminId: number) {
    const user = await this.usersRepository.findUserById(userId)
    this.ensureIsUser(user)
    await this.authRepository.revokeAllTokensForUser(userId, {
      revoked: true,
      revokedById: adminId,
      revokedAt: new Date(),
    })
  }

  private ensureIsAdmin(admin: User | null) {
    if (!admin) throw new AppError(ErrorCode.NOT_FOUND, 'Admin not found')
    if (admin.role === Role.User) throw new AppError(ErrorCode.INVALID_STATE, 'Not an admin')
  }

  private ensureIsUser(user: User | null) {
    if (!user) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    if (user.role !== Role.User) throw new AppError(ErrorCode.INVALID_STATE, 'Not a user')
  }
}
