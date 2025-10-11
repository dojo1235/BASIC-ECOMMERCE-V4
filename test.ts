import 'dotenv/config'
import { db } from './src/drizzle/db'
import { users } from './src/drizzle/schema'
import { eq } from 'drizzle-orm'

const main = async () => {
  try {
    // DELETE if exists
    await db.delete(users).where(eq(users.email, 'alice@example.com'))

    // CREATE
    const inserted = await db.insert(users).values({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret123',
    }).returning()
    console.log('Inserted user:', inserted)

    // FIND
    const found = await db.query.users.findFirst({
      where: eq(users.email, 'alice@example.com'),
    })
    console.log('Found user:', found)

    // UPDATE
    const updated = await db.update(users)
      .set({ name: 'Alice Updated' })
      .where(eq(users.email, 'alice@example.com'))
      .returning()
    console.log('Updated user:', updated)

    // DELETE
    const deleted = await db.delete(users)
      .where(eq(users.email, 'alice@example.com'))
      .returning()
    console.log('Deleted user:', deleted)

  } catch (err) {
    console.error('Error:', err)
  }
}

main()