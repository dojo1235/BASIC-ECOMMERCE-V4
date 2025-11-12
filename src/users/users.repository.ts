import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not, ILike, FindOptionsWhere } from 'typeorm'
import { User } from './entities/user.entity'
import { Role } from './entities/user.entity'
import { paginate } from 'src/common/utils/pagination.util'
import { FindUsersDto } from './dto/find-users.dto'

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async createUser(data: Partial<User>) {
    const entity = this.repository.create(data)
    return this.repository.save(entity)
  }

  async findAllAdmins(query: FindUsersDto) {
    const where: FindOptionsWhere<User> = {}
    if (query.search) where.email = ILike(`%${query.search}%`)
    if (query.role) where.role = query.role
    if (!query.role) where.role = Not(Role.User)
    if ('isBanned' in query) where.isBanned = query.isBanned
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const result = await paginate(this.repository, query, { where })
    return { users: result.items, meta: result.meta }
  }

  async findAllUsers(query: FindUsersDto) {
    const where: FindOptionsWhere<User> = { role: Role.User }
    if (query.search) where.email = ILike(`%${query.search}%`)
    if ('isBanned' in query) where.isBanned = query.isBanned
    if ('isDeleted' in query) where.isDeleted = query.isDeleted
    const result = await paginate(this.repository, query, { where })
    return { users: result.items, meta: result.meta }
  }

  async findUserById(userId: number) {
    return this.repository.findOne({ where: { id: userId } })
  }

  async findUserByEmail(email: string) {
    return this.repository.findOne({ where: { email } })
  }

  async updateUser(userId: number, data: Partial<User>) {
    return this.repository.update({ id: userId }, data)
  }
}
