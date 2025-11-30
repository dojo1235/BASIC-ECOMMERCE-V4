import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not, ILike, FindOptionsWhere } from 'typeorm'
import { User } from './entities/user.entity'
import { Profile } from './entities/profile.entity'
import { Address } from './entities/address.entity'
import { UserRole } from './entities/user.entity'
import { FindAdminsDto } from './dto/find-admins.dto'
import { FindUsersDto } from './dto/find-users.dto'
import { paginate } from 'src/common/utils/pagination.util'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async createUser(data: Partial<User>) {
    const entity = this.userRepository.create(data)
    return await this.userRepository.save(entity)
  }

  async findAllAdmins(query: FindAdminsDto) {
    const where: FindOptionsWhere<User> = {}
    if (query.search) where.email = ILike(`%${query.search}%`)
    if (query.role) where.role = query.role
    if (!query.role) where.role = Not(In([UserRole.User, UserRole.Seller]))
    if ('isBanned' in query) where.isBanned = query.isBanned
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const result = await paginate(this.userRepository, query, { where })
    return { users: result.items, meta: result.meta }
  }

  async findAllUsers(query: FindUsersDto) {
    const where: FindOptionsWhere<User> = {}
    if (query.search) where.email = ILike(`%${query.search}%`)
    if (query.role) where.role = query.role
    if (!query.role) where.role = In([UserRole.User, UserRole.Seller])
    if ('isBanned' in query) where.isBanned = query.isBanned
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const result = await paginate(this.userRepository, query, { where })
    return { users: result.items, meta: result.meta }
  }

  async findUserById(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId } })
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } })
  }

  async updateUser(userId: number, data: Partial<User>) {
    return await this.userRepository.update({ id: userId }, data)
  }

  async createProfile(data: Partial<Profile>) {
    const entity = this.profileRepository.create(data)
    return await this.profileRepository.save(entity)
  }

  async findProfile(userId: number) {
    return await this.profileRepository.findOne({ where: { userId } })
  }

  async updateProfile(userId: number, data: Partial<Profile>) {
    return await this.profileRepository.update({ userId }, data)
  }

  async createAddress(data: Partial<Address>) {
    const entity = this.addressRepository.create(data)
    return await this.addressRepository.save(entity)
  }

  async findAddresses(userId: number) {
    return await this.addressRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  async findAddressById(addressId: number, userId: number) {
    return await this.addressRepository.findOne({ where: { id: addressId, userId } })
  }

  async updateAddress(addressId: number, userId: number, data: Partial<Address>) {
    return await this.addressRepository.update({ id: addressId, userId }, data)
  }

  async clearDefaultAddress(userId: number) {
    await this.addressRepository.update({ userId }, { isDefault: false })
  }

  async deleteAddress(addressId: number, userId: number) {
    await this.addressRepository.delete({ id: addressId, userId })
  }
}
