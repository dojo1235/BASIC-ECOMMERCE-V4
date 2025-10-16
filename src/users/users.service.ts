import { Injectable } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { User } from './entities/user.entity'
import { UsersRepository } from './users.repository'
import { comparePassword, hashPassword } from 'src/common/utils/password.util'
import { Role } from './entities/user.entity'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  
  // Create admin (super admin)
  async createAdmin(data, superAdminId) {
    if (data.role === Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Creating user not allowed')
    const existing = await this.usersRepository.findUserByEmail(data.email)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    const hashedPassword = await hashPassword(data.password)
    delete data.password
    const created = await this.usersRepository.createUser({
      ...data,
      passwordHash: hashedPassword,
      createdBy: superAdminId,
    })
    return { user: plainToInstance(User, created) }
  }

  // Find all admins (super admin)
  async findAllAdmins(query) {
    if (query.role && query.role === Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Role is not an admin')
    const { users, meta } = await this.usersRepository.findAllAdmins(query)
    return { users: plainToInstance(User, users), meta }
  }

  // Find all users (admin)
  async findAllUsers(query) {
    const { users, meta } = await this.usersRepository.findAllUsers(query)
    return { users: plainToInstance(User, users), meta }
  }

  // Find one admin (admin)
  async findOneAdmin(userId) {
    const admin = await this.usersRepository.findUserById(userId)
    this.ensureIsAdmin(admin)
    return { user: plainToInstance(User, admin) }
  }

  // Find one user (both)
  async findOneUser(userId) {
    const user = await this.usersRepository.findUserById(userId)
    this.ensureIsUser(user)
    return { user: plainToInstance(User, user) }
  }
  
  // Update admin (super admin)
  async updateAdminForSuperAdmin(userId, data) {
    const admin = await this.usersRepository.findUserById(userId)
    this.ensureIsAdmin(admin)
    if (data.email) {
      const existing = await this.usersRepository.findUserByEmail(data.email)
      if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    }
    if (data.password) {
      data.passwordHash = await hashPassword(data.password)
      delete data.password
    }
    await this.usersRepository.updateUser(userId, data)
    const updated = await this.usersRepository.findUserById(userId)
    return { user: plainToInstance(User, updated) }
  }

  // Update admin (admin)
  async updateAdmin(userId, data) {
    if (data.password)
      throw new AppError(ErrorCode.INVALID_STATE, 'Use the change password endpoint')
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
  async updateUserForAdmin(userId, data) {
    const user = await this.usersRepository.findUserById(userId)
    this.ensureIsUser(user)
    if (data.email) {
      const existing = await this.usersRepository.findUserByEmail(data.email)
      if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    }
    if (data.password) {
      data.passwordHash = await hashPassword(data.password)
      delete data.password
    }
    await this.usersRepository.updateUser(userId, data)
    const updated = await this.usersRepository.findUserById(userId)
    return { user: plainToInstance(User, updated) }
  }
  
  // Update user (user)
  async updateUser(userId, data) {
    if (data.password)
      throw new AppError(ErrorCode.INVALID_STATE, 'Use the change password endpoint')
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
  
  // Update password (both)
  async updatePassword(userId, data) {
    if (data.newPassword === data.oldPassword)
      throw new AppError(ErrorCode.INVALID_STATE, 'Cannot update to same password')
    const user = await this.usersRepository.findUserById(userId)
    if (!user) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    const isValid = await comparePassword(data.oldPassword, user.passwordHash)
    if (!isValid)
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Old password is incorrect')
    const newHashed = await hashPassword(data.newPassword)
    await this.usersRepository.updateUser(userId, {
      passwordHash: newHashed,
      updatedAt: new Date,
    })
  }

  // Revoke all admin sessions (super admin)
  /*async revokeAllAdminSessions(id: number, superAdminId: number) {
    const admin = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsAdmin(admin)
    await db.update(refreshTokens)
      .set({
        revoked: true,
        revokedBy: superAdminId,
        revokedAt: new Date(),
      })
      .where(and(eq(refreshTokens.userId, id), eq(refreshTokens.revoked, false)))
  }

  // Revoke all user sessions (admin)
  async revokeAllUserSessions(id: number, adminId: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsUser(user)
    await db.update(refreshTokens)
      .set({
        revoked: true,
        revokedBy: adminId,
        revokedAt: new Date(),
      })
      .where(and(eq(refreshTokens.userId, id), eq(refreshTokens.revoked, false)))
  }*/
  
  // Helper: Ensure is admin
  private ensureIsAdmin(admin) {
    if (!admin) throw new AppError(ErrorCode.NOT_FOUND, 'Admin not found')
    if (admin.role === Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Not an admin')
  }

  // Helper: Ensure is user
  private ensureIsUser(user) {
    if (!user) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    if (user.role !== Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Not a user')
  }
  
}