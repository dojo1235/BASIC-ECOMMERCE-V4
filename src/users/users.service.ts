import { Injectable, HttpStatus } from '@nestjs/common'
import { db } from 'src/drizzle/db'
import { users, refreshTokens } from 'src/drizzle/schema'
import { eq, and, ne, ilike, or } from 'drizzle-orm'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { comparePassword, hashPassword } from 'src/common/utils/password.util'
import { Role } from 'src/common/enums/roles.enum'
import { paginate } from 'src/common/utils/pagination.util'
import { AppError } from 'src/common/errors/app-error'

@Injectable()
export class UsersService {
  // Ensure is admin
  private ensureIsAdmin(admin: any) {
    if (!admin) throw new AppError('Admin not found', HttpStatus.NOT_FOUND)
    if (admin.role === Role.User)
      throw new AppError('Not an admin', HttpStatus.BAD_REQUEST)
  }

  // Ensure is user
  private ensureIsUser(user: any) {
    if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND)
    if (user.role !== Role.User)
      throw new AppError('Not a user', HttpStatus.BAD_REQUEST)
  }

  // Create admin (super admin)
  async createAdmin(createAdminDto: any, superAdminId: number) {
    if (createAdminDto.role === Role.User)
      throw new AppError('Creating user not allowed', HttpStatus.BAD_REQUEST)
    const existing = await db.query.users.findFirst({
      where: eq(users.email, createAdminDto.email),
    })
    if (existing) throw new AppError('Email already exists', HttpStatus.CONFLICT)
    const hashedPassword = await hashPassword(createAdminDto.password)
    const [created] = await db.insert(users)
      .values({
        ...createAdminDto,
        password: hashedPassword,
        createdBy: superAdminId,
      })
      .returning() as any[]
    return { user: created }
  }

  // Find all admins (super admin)
  async findAllAdmins(query: Record<string, any>) {
    const { search, role, isBanned, isDeleted } = query
    const adminRoles = Object.values(Role).filter(r => r !== Role.User)
    if (role && !adminRoles.includes(role as any))
      throw new AppError('Invalid admin role', HttpStatus.BAD_REQUEST)
    const whereConditions: any[] = [ne(users.role, Role.User)]
    if (search) {
      whereConditions.push(
        or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)),
      )
    }
    if (role) whereConditions.push(eq(users.role, role))
    if ('isBanned' in query) whereConditions.push(eq(users.isBanned, query.isBanned === 'true'))
    if ('isDeleted' in query) whereConditions.push(eq(users.isDeleted, query.isDeleted === 'true'))
    const result = await paginate(db.query.users, users, whereConditions, query)
    return { users: result.items, meta: result.meta }
  }

  // Find all users (admin)
  async findAllUsers(query: Record<string, any>) {
    const { search, isBanned, isDeleted } = query
    const whereConditions: any[] = [eq(users.role, Role.User)]
    if (search) {
      whereConditions.push(
        or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)),
      )
    }
    if ('isBanned' in query) whereConditions.push(eq(users.isBanned, query.isBanned === 'true'))
    if ('isDeleted' in query) whereConditions.push(eq(users.isDeleted, query.isDeleted === 'true'))
    const result = await paginate(db.query.users, users, whereConditions, query)
    return { users: result.items, meta: result.meta }
  }

  // Find one admin (admin)
  async findOneAdmin(id: number) {
    const admin = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsAdmin(admin)
    return { user: admin }
  }

  // Find one user (both)
  async findOneUser(id: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsUser(user)
    return { user }
  }
  
  // Update admin (super admin)
  async updateAdminForSuperAdmin(id: number, dto: any) {
    const admin = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsAdmin(admin)
    if ('email' in dto) {
      const normalizedEmail = dto.email.trim().toLowerCase()
      const existing = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      })
      if (existing)
        throw new AppError('Email already exists', HttpStatus.CONFLICT)
      dto.email = normalizedEmail
    }
    if ('password' in dto) {
      dto.password = await hashPassword(dto.password)
    }
    const [updated] = await db.update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning() as any[]
    return { user: updated }
  }

  // Update admin (admin)
  async updateAdmin(id: number, dto: any) {
    if ('password' in dto)
      throw new AppError('Use the change password endpoint', HttpStatus.FORBIDDEN)
    const admin = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsAdmin(admin)
    if ('email' in dto) {
      const normalizedEmail = dto.email.trim().toLowerCase()
      const existing = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      })
      if (existing)
        throw new AppError('Email already exists', HttpStatus.CONFLICT)
      dto.email = normalizedEmail
    }
    const [updated] = await db.update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning() as any[]
    return { user: updated }
  }
  
  // Update user (admin)
  async updateUserForAdmin(id: number, dto: any) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsUser(user)
    if ('email' in dto) {
      const normalizedEmail = dto.email.trim().toLowerCase()
      const existing = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      })
      if (existing)
        throw new AppError('Email already exists', HttpStatus.CONFLICT)
      dto.email = normalizedEmail
    }
    if ('password' in dto) {
      dto.password = await hashPassword(dto.password)
    }
    const [updated] = await db.update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning() as any []
    return { user: updated }
  }
  
  // Update user (user)
  async updateUser(id: number, dto: any) {
    if ('password' in dto)
      throw new AppError('Use the change password endpoint', HttpStatus.FORBIDDEN)
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    this.ensureIsUser(user)
    if ('email' in dto) {
      const normalizedEmail = dto.email.trim().toLowerCase()
      const existing = await db.query.users.findFirst({
        where: eq(users.email, normalizedEmail),
      })
      if (existing)
        throw new AppError('Email already exists', HttpStatus.CONFLICT)
      dto.email = normalizedEmail
    }
    const [updated] = await db.update(users)
      .set(dto)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      }) as any[]
    return { user: updated }
  }
  
  // Update password (both)
  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    if (updatePasswordDto.newPassword === updatePasswordDto.oldPassword)
      throw new AppError('Cannot update to same password', HttpStatus.BAD_REQUEST) 
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    if (!user) throw new AppError('User not found', HttpStatus.NOT_FOUND)
    const isValid = await comparePassword(updatePasswordDto.oldPassword, user.password)
    if (!isValid)
      throw new AppError('Old password is incorrect', HttpStatus.UNAUTHORIZED)
    const newHashed = await hashPassword(updatePasswordDto.newPassword)
    await db.update(users)
      .set({ password: newHashed, updatedAt: new Date() })
      .where(eq(users.id, id))
  }

  // Revoke all admin sessions (super admin)
  async revokeAllAdminSessions(id: number, superAdminId: number) {
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
  }
}