import 'dotenv/config'
import { DataSource } from 'typeorm'
import { User } from './src/users/entities/user.entity'

const options = {
  type: 'mysql' as const,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: false,
}

const main = async () => {
  const dataSource = new DataSource(options)
  await dataSource.initialize()
  const usersRepo = dataSource.getRepository(User)

  try {
    // DELETE if exists
    const existing = await usersRepo.findOne({ where: { email: 'alice@example.com' } })
    if (existing) {
      await usersRepo.delete(existing.id)
      console.log('Deleted existing user:', existing)
    }

    // CREATE
    const inserted = await usersRepo.save(usersRepo.create({
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'secret123',
    }))
    console.log('Inserted user:', inserted)

    // FIND
    const found = await usersRepo.findOne({ where: { email: 'alice@example.com' } })
    if (!found) throw new Error('User not found')
    console.log('Found user:', found)

    // UPDATE
    const updated = await usersRepo.save({ id: found.id, name: 'Alice Updated' })
    console.log('Updated user:', updated)

    // DELETE
    const deleted = await usersRepo.delete(found.id)
    console.log('Deleted user:', deleted)

  } catch (err) {
    console.error('Error during CRUD test:', err)
  } finally {
    await dataSource.destroy()
  }
}

main()