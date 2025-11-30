import { Injectable } from '@nestjs/common'
import { AuthRepository } from '../auth/auth.repository'
import { UsersRepository } from './users.repository'
import { CountriesRepository } from 'src/countries/countries.repository'
import { CreateAdminDto } from './dto/create-admin.dto'
import { CreateProfileDto } from './dto/create-profile.dto'
import { CreateAddressDto } from './dto/create-address.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { FindAdminsDto } from './dto/find-admins.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { User } from './entities/user.entity'
import { Profile } from './entities/profile.entity'
import { Address } from './entities/address.entity'
import { UserRole } from 'src/users/entities/user.entity'
import { hash, compare } from 'src/common/utils/crypto.util'
import { AppError, ErrorCode } from 'src/common/exceptions/app-error'

type UpdateUserInput = Partial<User> & { password?: string }

@Injectable()
export class UsersService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly countriesRepository: CountriesRepository,
  ) {}

  // Create admin (super admin)
  async createAdmin(superAdminId: number, { password, ...data }: CreateAdminDto) {
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
  async findAllAdmins(query: FindAdminsDto) {
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

  // Update email (both)
  async updateEmail(userId: number, { email }: Partial<User>) {
    if (!email) throw new AppError(ErrorCode.VALIDATION_ERROR, 'Email is required')
    const user = await this.usersRepository.findUserById(userId)
    if (!user) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    if (user.email === email) return { user }
    const existing = await this.usersRepository.findUserByEmail(email)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Email already exists')
    await this.usersRepository.updateUser(userId, {
      email,
      updatedById: userId,
      updatedAt: new Date(),
    })
    const updated = await this.usersRepository.findUserById(userId)
    return { user: updated }
  }

  // Update password (both)
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

  async deleteUserAccount(userId: number) {
    const existing = await this.usersRepository.findUserById(userId)
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    await this.usersRepository.updateUser(userId, {
      isDeleted: true,
      deletedById: userId,
      deletedAt: new Date(),
    })
    await this.authRepository.revokeAllTokensForUser(userId, {
      revoked: true,
      revokedById: userId,
      revokedAt: new Date(),
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
  async createProfile(userId: number, data: CreateProfileDto) {
    const existing = await this.usersRepository.findProfile(userId)
    if (existing) throw new AppError(ErrorCode.INVALID_STATE, 'Profile already exists')
    const created = await this.usersRepository.createProfile({
      ...data,
      userId,
    })
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
  async createAddress(userId: number, data: CreateAddressDto) {
    const country = await this.countriesRepository.findCountryById(data.countryId)
    if (!country) throw new AppError(ErrorCode.NOT_FOUND, 'Country not found')
    if (data.isDefault) await this.usersRepository.clearDefaultAddress(userId)
    const created = await this.usersRepository.createAddress({
      ...data,
      userId,
    })
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
    if (admin.role === UserRole.User || admin.role === UserRole.Seller)
      throw new AppError(ErrorCode.INVALID_STATE, 'Not an admin')
  }

  private ensureIsUser(user: User | null) {
    if (!user) throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
    if (user.role !== UserRole.User) throw new AppError(ErrorCode.INVALID_STATE, 'Not a user')
  }
}
