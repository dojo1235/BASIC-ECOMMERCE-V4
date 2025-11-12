import { Injectable } from '@nestjs/common'
import { User } from './entities/user.entity'
import { Profile } from './entities/profile.entity'
import { Address } from './entities/address.entity'
import { AuthRepository } from '../auth/auth.repository'
import { UsersRepository } from './users.repository'
import { CountriesRepository } from 'src/countries/countries.repository'
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
    private readonly countriesRepository: CountriesRepository,
  ) {}

  // Create admin (super admin)
  async createAdmin({ password, ...data }: CreateAdminDto, superAdminId: number) {
    if (data.role === Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Creating user not allowed')
    const existing = await this.usersRepository.findUserByEmail(data.email)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    const passwordHash = await hash(password)
    const created = await this.usersRepository.createUser({
      ...data,
      passwordHash,
      createdById: superAdminId,
    })
    return { user: created }
  }

  // Find all admins
  async findAllAdmins(query: FindUsersDto) {
    if (query.role && query.role === Role.User)
      throw new AppError(ErrorCode.INVALID_STATE, 'Role is not an admin')
    return await this.usersRepository.findAllAdmins(query)
  }

  // Find all users
  async findAllUsers(query: FindUsersDto) {
    return await this.usersRepository.findAllUsers(query)
  }

  // Find one admin
  async findOneAdmin(userId: number) {
    const admin = await this.usersRepository.findUserById(userId)
    this.ensureIsAdmin(admin)
    return { user: admin }
  }

  // Find one user
  async findOneUser(userId: number) {
    const user = await this.usersRepository.findUserById(userId)
    this.ensureIsUser(user)
    return { user }
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
    return { user: updated }
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
    return { user: updated }
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
    return { user: updated }
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
    return { user: updated }
  }

  // Update password
  async updatePassword(userId: number, { oldPassword, newPassword }: UpdatePasswordDto) {
    if (newPassword === oldPassword)
      throw new AppError(ErrorCode.INVALID_STATE, 'Cannot update to same password')
    const user = await this.usersRepository.findUserById(userId)
    if (!user) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    const isValid = await compare(oldPassword, user.passwordHash)
    if (!isValid) throw new AppError(ErrorCode.INVALID_CREDENTIALS, 'Old password is incorrect')
    const passwordHash = await hash(newPassword)
    await this.usersRepository.updateUser(userId, {
      passwordHash,
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

  // Create profile(both)
  async createProfile(data: Partial<Profile>) {
    if (!data.userId) throw new AppError(ErrorCode.VALIDATION_ERROR, 'User ID is required')
    const existing = await this.usersRepository.findProfile(data.userId)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Profile already exists')
    const created = await this.usersRepository.createProfile(data)
    return { profile: created }
  }

  // Find Profile (both)
  async findProfile(userId: number) {
    const profile = await this.usersRepository.findProfile(userId)
    if (!profile) throw new AppError(ErrorCode.NOT_FOUND, 'Profile not found')
    return { profile }
  }

  // Update profile details (both)
  async updateProfile(userId: number, data: Partial<Profile>) {
    const existing = await this.usersRepository.findProfile(userId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Profile not found')
    await this.usersRepository.updateProfile(userId, data)
    const updated = await this.usersRepository.findProfile(userId)
    return { profile: updated }
  }

  // Create new address (both)
  async createAddress(data: Partial<Address>) {
    if (!data.countryId) throw new AppError(ErrorCode.VALIDATION_ERROR, 'Country ID is required')
    if (!data.userId) throw new AppError(ErrorCode.VALIDATION_ERROR, 'User ID is required')
    const country = await this.countriesRepository.findCountryById(data.countryId)
    if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    if (data.isDefault) await this.usersRepository.clearDefaultAddress(data.userId)
    const created = await this.usersRepository.createAddress(data)
    return { address: created }
  }

  // Find addresses (both)
  async findAddresses(userId: number) {
    const addresses = await this.usersRepository.findAddresses(userId)
    return { addresses }
  }

  // Find single address (both)
  async findAddressById(addressId: number, userId: number) {
    const address = await this.usersRepository.findAddressById(addressId, userId)
    if (!address) throw new AppError(ErrorCode.NOT_FOUND, 'Address not found')
    return { address }
  }

  // Update address (both)
  async updateAddress(addressId: number, userId: number, data: Partial<Address>) {
    const existing = await this.usersRepository.findAddressById(addressId, userId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Address not found')
    if (data.countryId) {
      const country = await this.countriesRepository.findCountryById(data.countryId)
      if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    }
    if (data.isDefault) await this.usersRepository.clearDefaultAddress(userId)
    await this.usersRepository.updateAddress(addressId, userId, data)
    const updated = await this.usersRepository.findAddressById(addressId, userId)
    return { address: updated }
  }

  // Hard-Delete address (both)
  async deleteAddress(addressId: number, userId: number) {
    const existing = await this.usersRepository.findAddressById(addressId, userId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Address not found')
    await this.usersRepository.deleteAddress(addressId, userId)
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
