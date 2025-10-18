import 'dotenv/config'
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import * as schema from './schema'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) throw new Error('❌ DATABASE_URL is not defined in environment variables')

let pool: Pool | null = null
let db: NeonDatabase<typeof schema>

const MAX_RETRIES = 5
const RETRY_DELAY = 3000
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

async function createConnection(): Promise<NeonDatabase<typeof schema>> {
  pool = new Pool({ connectionString: dbUrl })
  const drizzleDb = drizzle(pool, { schema })
  await drizzleDb.execute('SELECT 1')
  console.log('✅ Connected to Neon (transaction-capable)')
  return drizzleDb
}

async function initDb(retries = 0): Promise<void> {
  try {
    db = await createConnection()
  } catch (err) {
    const isConnectionErr =
      String(err).includes('Connection terminated') ||
      String(err).includes('ECONNREFUSED') ||
      String(err).includes('timeout')

    if (isConnectionErr && retries < MAX_RETRIES) {
      console.warn(
        `⚠️ Neon connection failed. Retrying (${retries + 1}/${MAX_RETRIES}) in ${RETRY_DELAY / 1000}s...`,
      )
      await sleep(RETRY_DELAY)
      return initDb(retries + 1)
    }

    console.error('❌ Failed to connect to Neon after retries:', err)
  }
}

// Immediately start connection (non-blocking)
initDb().catch((err) => console.error('❌ Neon init failed:', err))

process.on('unhandledRejection', (reason) => {
  if (String(reason).includes('Connection terminated')) {
    console.warn('⚠️ Neon connection lost — attempting auto-reconnect...')
    initDb()
  } else {
    console.error('⚠️ Unhandled Rejection:', reason)
  }
})

process.on('uncaughtException', (error) => {
  if (String(error).includes('Connection terminated')) {
    console.warn('⚠️ Neon connection lost — attempting auto-reconnect...')
    initDb()
  } else {
    console.error('⚠️ Uncaught Exception:', error)
  }
})

export { db }

/*import 'dotenv/config'
import { drizzle, NeonDatabase } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import * as schema from './schema'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) throw new Error('❌ DATABASE_URL is not defined in environment variables')

// Use Pool instead of neon() — this supports transactions
const pool = new Pool({ connectionString: dbUrl })

// Use neon-serverless driver for drizzle
export const db: NeonDatabase<typeof schema> = drizzle(pool, { schema })

// Optional: verify connection
const verifyConnection = async () => {
  try {
    await db.execute('SELECT 1')
    console.log('✅ Connected to Neon (transaction-capable)')
  } catch (err) {
    console.error('❌ Failed to connect to Neon:')
  }
}

// Only call this in dev or bootstrap
verifyConnection()*/
